import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
import "./components/header.js";
import "./components/main.js";
import "./components/heading.js";
import "./components/button.js";
import "./components/table.js";
import "./tables.js";
import "./backups.js";

class App extends LitElement {
  static styles = css`
    .main {
      margin-top: 32px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: flex-start;
      gap: 32px;
    }
  `;

  firstUpdated() {
    fetch("/tables")
      .then((res) => res.json())
      .then((tables) => {
        const element = document.createElement("app-tables");
        element.tables = tables;
        this.renderRoot.querySelector(".tables").replaceWith(element);
      })
      .catch((err) => console.error(err));

    fetch("/backups")
      .then((res) => res.json())
      .then((backups) => {
        const element = document.createElement("app-backups");
        element.backups = backups;
        this.renderRoot.querySelector(".backups").replaceWith(element);
      })
      .catch((err) => console.error(err));
  }

  render() {
    return html`
      <app-header label="Kubetools Postgres Backup"></app-header>
      <app-main>
        <div class="main">
          <div class="tables"></div>
          <div class="backups"></div>
        </div>
      </app-main>
    `;
  }
}

window.customElements.define("app-body", App);
