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
import { AppErrorEvent } from "./events.js";

class App extends LitElement {
  static styles = css`
    #main {
      margin-top: 32px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: flex-start;
      gap: 32px;
    }
  `;

  get #tables() {
    return this.renderRoot.querySelector("#tables,app-tables");
  }

  get #backups() {
    return this.renderRoot.querySelector("#backups,app-backups");
  }

  async #fetchTables() {
    try {
      const res = await fetch("/tables");
      const tables = await res.json();
      const element = document.createElement("app-tables");
      element.tables = tables;
      element.addEventListener("backup-created", () => this.#fetchBackups());
      this.#tables.replaceWith(element);
    } catch (err) {
      this.dispatchEvent(new AppErrorEvent(err));
    }
  }

  async #fetchBackups() {
    try {
      const res = await fetch("/backups");
      const backups = await res.json();
      const element = document.createElement("app-backups");
      element.backups = backups;
      this.#backups.replaceWith(element);
    } catch (err) {
      this.dispatchEvent(new AppErrorEvent(err));
    }
  }

  firstUpdated() {
    this.#fetchTables();
    this.#fetchBackups();
  }

  render() {
    return html`
      <app-header title="Kubetools Postgres Backup"></app-header>
      <app-main>
        <div id="main">
          <div id="tables"></div>
          <div id="backups"></div>
        </div>
      </app-main>
    `;
  }
}

window.customElements.define("app-body", App);
