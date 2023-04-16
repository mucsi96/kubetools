import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class AppButton extends LitElement {
  static properties = {
    disabled: { type: Boolean },
  };

  static styles = css`
    button {
      background-color: rgb(28, 100, 242);
      border: 1px solid rgb(28, 100, 242);
      padding: 10px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
    }

    button:not(:disabled):hover {
      background-color: rgb(26, 86, 219);
      border: 1px solid rgb(26, 86, 219);
      cursor: pointer;
    }

    button:disabled {
      background-color: rgb(31, 41, 55);
      color: rgb(156, 163, 175);
      border: 1px solid rgb(75, 85, 99);
    }
  `;

  render() {
    return html`
      <button type="${this.type}" ?disabled="${this.disabled}">
        <slot></slot>
      </button>
    `;
  }
}

window.customElements.define("app-button", AppButton);
