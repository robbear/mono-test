// Components are just functions that accept an Express request object and
// return the text content for the response to that request.
module.exports = {
  '/error': {'path': require('./components/ErrorPage.js'), 'method': 'GET'},
  '/manifest.json': {'path': require('./components/Manifest.js'), 'method': 'GET'},
  '/notfound': {'path': require('./components/PageNotFound.js'), 'method': 'GET'},
  '/robots.txt': {'path': require('./components/Robots.js'), 'method': 'GET'},
  '/': {'path': require('./components/HomePage.js'), 'method': 'GET'}
};
