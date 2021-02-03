const { jsxToTextWith } = require('litjsx');
const PageTemplate = require('./PageTemplate.js');
const html = jsxToTextWith({ PageTemplate });

/*
 * Error page
 */
module.exports = (request) => {
  return html`
    <PageTemplate title="Oops" request="${request}">
      <h1>Oops</h1>
      <p>
        Sorry, something went wrong. 😞
      </p>
    </PageTemplate>
  `;
};
