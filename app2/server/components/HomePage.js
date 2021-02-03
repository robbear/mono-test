const { jsxToTextWith } = require('litjsx');
const PageTemplate = require('./PageTemplate.js');
const html = jsxToTextWith({ PageTemplate });

/**
 * Home page
 */
module.exports = async (request) => {

  const staticPath = request.app.locals.staticPath;
  const NODE_ENV = request.app.locals.NODE_ENV;
  const DEFAULT_DESCRIPTION = "RAI-UX";

  let description = DEFAULT_DESCRIPTION;

  return html`
    <PageTemplate request="${request}" description="${description}" >
      <noscript>
        Please enable JavaScript to view this app.
      </noscript>
    </PageTemplate>
  `;
};
