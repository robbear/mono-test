const { jsxToTextWith } = require('litjsx');
const html = jsxToTextWith();

// BUGBUG: Put strings like this in a centralized strings file
const DEFAULT_DESCRIPTION = "RAI-UX"
const APP_NAME = "RAI-UX";

/**
 * Main page template
 */
module.exports = async (props) => {
    
  const request = props.request;
  const staticPath = request.app.locals.staticPath;
  const NODE_ENV = request.app.locals.NODE_ENV;

  let description = props.description ? props.description : DEFAULT_DESCRIPTION;
  let titleBar = APP_NAME;
  
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXX-X"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-XXXX-X');
        </script>
        <base href="${staticPath}/">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes">
        <meta name="theme-color" content="#0094dd"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-title" content="${APP_NAME}"/>
        <meta name="description" content="${description}"/>
        <title>${titleBar}</title>
        <link rel="shortcut icon" href="images/icons/rai-icon.png">
        <link rel="stylesheet" href="styles/styles.css">
        <link rel="manifest" href="/manifest.json">
        <link rel="apple-touch-icon" href="images/icons/rai-512x512.png"/>
      </head>
      <body>
        ${props.children}
        <script type="module" defer="">
          import {Workbox} from 'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-window.prod.mjs'; 
          window.Workbox = Workbox;
        </script>
        <script>
          window.rai_console = {
            config: {
              environment: '${NODE_ENV}'
            }
          };        
        </script>
    <div id="app-container"> </div>
        <script type="module" src="generated/bundle.js" defer></script>
      </body>
    </html>
  `;
};
