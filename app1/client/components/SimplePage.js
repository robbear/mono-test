import ReactiveElement from '../reactive/core/ReactiveElement.js';
import * as internal from '../reactive/core/internal.js';
import { templateFrom } from '../reactive/core/htmlLiterals.js';
import './SpinBox.js';

// Shared test
import sharedString from '../../../shared/string.js';

class SimplePage extends ReactiveElement {
  constructor() {
    super();
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      "appValue": 0,
      "multiplier": 10
    });
  }

  get appValue() {
    return this[internal.state].appValue;
  }
  set appValue(appValue) {
    this[internal.setState]({appValue});
  }

  get multiplier() {
    return this[internal.state].multiplier;
  }
  set multiplier(multIn) {
    const multiplier = parseInt(multIn);
    this[internal.setState]({multiplier});
  }

  componentFirstRender() {
    this[internal.ids].spin.addEventListener('change', (ev) => {
      this.appValue = ev.detail.value * this.multiplier;
    });
  }

  get [internal.template]() {
    return templateFrom.html`
      <style>
        div {
          margin-top: 20px;
        }
      </style>
      <div id="container">
        <div>
          ${sharedString}
        </div>
        <div>
          <spin-box id="spin"></spin-box>
        <div>
        <div>
          SpinBox x <span id="mult"></span> = <span id="computedValue"></span>
        </div>
      </div>
    `
  }

  [internal.render](changed) {
    super[internal.render](changed);

    if (this[internal.firstRender]) {
      this.componentFirstRender();
    }

    if (changed.appValue) {
      this[internal.ids].computedValue.innerHTML = this.appValue;
    }

    if (changed.multiplier) {
      this[internal.ids].mult.innerHTML = this.multiplier;
    }
  }
}

customElements.define('simple-page', SimplePage);
export default SimplePage;
