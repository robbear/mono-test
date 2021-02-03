import ReactiveElement from '../reactive/core/ReactiveElement.js';
import * as internal from '../reactive/core/internal.js';
import { templateFrom } from '../reactive/core/htmlLiterals.js';

class GreenSpinBox extends ReactiveElement {
  constructor() {
    super();    
  }

  get [internal.defaultState]() {
    return Object.assign(super[internal.defaultState], {
      "value": 0
    });
  }

  get value() {
    return this[internal.state].value;
  }
  set value(value) {
    this[internal.setState]({value});
  }

  componentFirstRender() {
    this[internal.ids].input.addEventListener('input', () => {
      this.value = this[internal.ids].input.value;
    });

    this[internal.ids].upButton.addEventListener('mousedown', () => {
      this.value++;
    });

    this[internal.ids].downButton.addEventListener('mousedown', () => {
      this.value--;
    });
  }

  get [internal.template]() {
    return templateFrom.html`
      <style>
        :host {
          display: inline-grid;
        }

        #input {
          grid-row-end: 3;
          grid-row-start: 1;
          text-align: right;
          background-color: green;
        }

        #upButton,
        #downButton {
          grid-column: 2;
          user-select: none;
        }
      </style>
      <input id="input"></input>
      <button id="upButton">▲</button>
      <button id="downButton">▼</button>
    `;
  }

  [internal.render](changed) {
    super[internal.render](changed);

    if (this[internal.firstRender]) {
      this.componentFirstRender();
    }

    if (changed.value) {
      this[internal.ids].input.value = this.value;
      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: {
          value: this.value
        }
      }));
    }
  }
}

customElements.define('green-spin-box', GreenSpinBox);
export default GreenSpinBox;
