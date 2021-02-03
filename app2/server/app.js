/*
 * Simple web server implementation based on Express.js
 */

const dotenv = require('dotenv');
dotenv.config();

const { 
  NODE_ENV
} = process.env;

const requestIp = require('request-ip');
const compression = require('compression');
const express = require('express');
const path = require('path');
const port = process.env.PORT || 5000;
const routes = require('./routes.js');

const ErrorPage = routes['/error'].path;
const NotFoundPage = routes['/notfound'].path;

// Create our Express app and turn on compression.
const app = express();
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Redirects
app.get('*', (request, response, next) => {

  let redirectUrl;
  if (request.headers['x-forwarded-proto'] && request.headers['x-forwarded-proto'] !== 'https') {
    // Redirect http to https under Heroku.
    redirectUrl = `https://${request.hostname}${request.url}`;
  }

  if (redirectUrl) {
    response.redirect(301, redirectUrl);
  } else {
    // Continue to other routes if we're not redirecting.
    next();
  }
});

// Behavior shared by all requests.
app.use((request, response, next) => {
  // Log all requests.
  const clientIp = requestIp.getClientIp(request);
  console.log(`${clientIp}: ${request.url}`);
  // Enable CORS
  // From http://enable-cors.org/server_expressjs.html
  response.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With'
  });
  next();
});

// Create handlers for the routes that map to components.
for (const [route, component] of Object.entries(routes)) {
  switch (component.method) {
    case 'GET':
      app.get(route, handlerUsingComponent(component.path));
      break;
    case 'POST':
      app.post(route, handlerUsingComponent(component.path));
      break;
    case 'PUT':
      app.put(route, handlerUsingComponent(component.path));
      break;
    case 'DELETE':
      app.delete(route, handlerUsingComponent(component.path));
      break;
  }
}

let TIMESTAMP;
try {
  TIMESTAMP = require('../client/generated/timestamp.js');
}
catch (e) {
  console.warn(`Warning: Can't find client/generated/timestamp.js. Run "npm build" to create it.`);
  TIMESTAMP = '00000000000000';
}

// Save timestamp for build info in the client
app.locals.timestamp = TIMESTAMP;

// Determine whether static resources will be served at the default path.
const cacheBust = NODE_ENV === 'production' || NODE_ENV === 'test';
const build = cacheBust ? TIMESTAMP : 'src';
const staticPath = `/static/${build}`;

// Save static path on the app for use in constructing responses.
app.locals.staticPath = staticPath;

// node_modules folder
const nodeModulesFolder = path.join(__dirname, '../node_modules');
app.use(`${staticPath}/node_modules`, express.static(nodeModulesFolder, {
  // If we're using cache-busting, set max-age to 365 days.
  maxAge: cacheBust ? 1000*60*60*24*365 : 0
}));

// Tell Express to serve up static content.
const staticFolder = path.join(__dirname, `../client`);
app.use(staticPath, express.static(staticFolder, {
  // If we're using cache-busting, set max-age to 365 days.
  maxAge: cacheBust ? 1000*60*60*24*365 : 0
}));


// Server environment
app.locals.NODE_ENV = NODE_ENV ? NODE_ENV : 'dev';

// Not found
app.get('*', async (request, response) => {
  const content = await NotFoundPage(request);
  response.status(404);
  response.set({
    'Content-Type': 'text/html',
    'Cache-Control': 'no-cache'
  });
  response.send(content);
});

// Main async sequence.
async function start() {
  // Start handling requests.
  await new Promise(resolve => app.listen(port, resolve));

  console.log(`Server listening on http://localhost:${port}, cache-busting: ${cacheBust}, NODE_ENV: ${NODE_ENV}`);
}

//
// Helpers
//

// Given a component, return a handler for requests using that component.
function handlerUsingComponent(component) {
  return async (request, response) => {
    let content;
    try {
      content = await component(request);
    } catch (exception) {
      console.error(`*** EXCEPTION: ${exception}`);
      content = ErrorPage(request);
      response.status(500);
    }
    response.set({
      'Content-Type': inferContentType(content),
      'Cache-Control': 'no-cache'
    });
    response.send(content);
  }
}

// Given textual content to return, infer its Content-Type.
function inferContentType(content) {
  if (content.startsWith('<!DOCTYPE html>') || 
      content.startsWith('<!doctype html>') ||
      content.startsWith('<html')) {
    return 'text/html';
  } else if (content.startsWith('<?xml')) {
    return 'text/xml';
  } else if (content.startsWith('{')) {
    return 'application/json';
  } else {
    return 'text/plain';
  }
}

// Initiate main async sequence.
// (Use top-level async function when Node supports that.)
(async () => {
  try {
    await start();
  } catch (exception) {
    // We have to handle the exception, since nothing else will.
    console.error(`*** EXCEPTION: ${exception}`);
  }
})();
