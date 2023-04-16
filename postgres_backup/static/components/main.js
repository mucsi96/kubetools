import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class AppMain extends LitElement {
  static styles = css`
    :host {
      display: block;
      background-color: rgb(15, 23, 42);
      color: rgb(156, 163, 175);
      font-family: system-ui;
      font-size: 14px;
      padding: 1px 0;
    }
    
    main {
      padding: 0 1rem;
      max-width: 90rem;
      margin: 0 auto;
    }
  `;

  render() {
    return html`
      <main>
          <slot></slot>
      </main>
    `;
  }
}

window.customElements.define("app-main", AppMain);
