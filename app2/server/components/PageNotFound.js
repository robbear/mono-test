const { jsxToTextWith } = require('litjsx');
const PageTemplate = require('./PageTemplate.js');
const html = jsxToTextWith({ PageTemplate });

/*
 * Page not found
 */
module.exports = (request) => {
  return html`
    <PageTemplate title="Not found" request="${request}">
      <header class="block aqua padded">
        <h1>Not found</h1>
      </header>
      <section>
        <p>
          Sorry, we don't have a page for this. 😞
        </p>
      </section>
    </PageTemplate>
  `;
};
