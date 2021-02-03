import React from 'react';
import ReactDom from 'react-dom';

import { App } from './components/app.js';

ReactDom.render(
  React.createElement(App),
  document.querySelector('#app-container'),
);
