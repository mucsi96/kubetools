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
import "./components/notifications.js";
import "./tables.js";
import "./backups.js";
import { AppErrorEvent } from "./events.js";
import {
  ErrorNotificationEvent,
  SuccessNotificationEvent,
} from "./components/notifications.js";
import { fetchJSON } from "./utils.js";

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

  constructor() {
    super();
    document.addEventListener("app-error", (event) => {
      console.error(event.details.error);
      this.dispatchEvent(new ErrorNotificationEvent(event.details.message));
    });
  }

  async #fetchTables() {
    try {
      this.tables = await fetchJSON("/tables");
    } catch (err) {
      this.tables = [];
      this.dispatchEvent(new AppErrorEvent("Unable to fetch tables", err));
    }
  }

  async #fetchBackups() {
    try {
      this.backups = await fetchJSON("/backups");
    } catch (err) {
      this.backups = [];
      this.dispatchEvent(new AppErrorEvent("Unable to fetch backups", err));
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
          <app-tables
            .tables=${this.tables}
            @backup-created=${() => {
              this.#fetchBackups();
              this.dispatchEvent(
                new SuccessNotificationEvent("Backup created")
              );
            }}
          ></app-tables>
          <app-backups .backups=${this.backups}></app-backups>
        </div>
      </app-main>
      <app-notifications></app-notifications>
    `;
  }
}

window.customElements.define("app-body", App);
