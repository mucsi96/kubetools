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
import "./components/loader.js";
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

  static properties = {
    tables: { type: Array },
    backups: { type: Array },
  };

  async #fetchTables() {
    try {
      const res = await fetch("/tables");
      this.tables = await res.json();
    } catch (err) {
      this.tables = []
      this.dispatchEvent(new AppErrorEvent(err));
    }
  }

  async #fetchBackups() {
    try {
      const res = await fetch("/backups");
      this.backups = await res.json();
    } catch (err) {
      this.backups = []
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
          <app-tables .tables=${this.tables}></app-tables>
          <app-backups .backups=${this.backups}></app-backups>
        </div>
      </app-main>
    `;
  }
}

window.customElements.define("app-body", App);
