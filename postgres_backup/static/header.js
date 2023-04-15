import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class AppHeader extends LitElement {
  static properties = {
    label: "",
  };

  static styles = css`
    header {
      background-color: rgb(31, 41, 55);
      border-bottom: 1px solid rgb(75, 85, 99);
      position: sticky;
      top: 0;
      z-index: 40;
    }

    .wrapper {
      padding: 18px 1rem 19px;
      max-width: 90rem;
      margin: 0 auto;
    }

    h1 {
      font-size: 24px;
      margin: 0;
    }
  `;

  constructor() {
    super();
  }

  render() {
    return html`
      <header>
        <div class="wrapper">
          <h1>${this.label}</h1>
        </div>
      <header>
    `
  }
}

window.customElements.define("app-header", AppHeader);
