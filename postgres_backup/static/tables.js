import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
import { BackupCreatedEvent, AppErrorEvent } from "./events.js";
import { fetchJSON } from "./utils.js";

class AppTables extends LitElement {
  static properties = {
    tables: { type: Array },
    "total-count": { type: Number },
    processing: { type: Boolean },
  };

  static styles = css`
    :host {
      display: grid;
      gap: 20px;
    }
  `;

  render() {
    this.style.justifyContent = this.tables ? "flex-start" : "center";

    if (!this.tables) {
      return html`<app-loader></app-loader>`;
    }

    return html`
      <app-heading level="2"
        >Tables <app-badge>${this.tables.length}</app-badge></app-heading
      >
      <app-table>
        <app-thead>
          <app-tr>
            <app-th>Name</app-th>
            <app-th>Rows</app-th>
          </app-tr>
        </app-thead>
        <app-tbody>
          ${this.tables.map(
            (table) => html`
              <app-tr>
                <app-td highlighted>${table.name}</app-td>
                <app-td>${table.count}</app-td>
              </app-tr>
            `
          )}
          <app-tr>
            <app-td highlighted><i>total</i></app-td>
            <app-td>${this["total-count"]}</app-td>
          </app-tr>
        </app-tbody>
      </app-table>
      <app-button ?disabled=${this.processing} @click="${() => this.#backup()}"
        >Backup</app-button
      >
    `;
  }

  #backup() {
    this.processing = true;
    fetchJSON("/backup", { method: "POST" })
      .then(() => this.dispatchEvent(new BackupCreatedEvent()))
      .catch((err) =>
        this.dispatchEvent(new AppErrorEvent("Unable to create backup", err))
      )
      .finally(() => {
        this.processing = false;
      });
  }
}

window.customElements.define("app-tables", AppTables);
