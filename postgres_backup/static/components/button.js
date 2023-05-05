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
      background-color: hsl(220, 89%, 53%);
      border: 1px solid hsl(220, 89%, 53%);
      padding: 10px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
    }

    button:not(:disabled):hover {
      background-color: hsl(221, 79%, 48%);
      border: 1px solid hsl(221, 79%, 48%);
      cursor: pointer;
    }

    button:disabled {
      background-color: hsl(215, 28%, 17%);
      color: hsl(218, 11%, 65%);
      border: 1px solid hsl(215, 14%, 34%);
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
