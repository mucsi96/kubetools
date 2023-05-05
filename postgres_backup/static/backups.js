import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
import { fetchJSON, getRelativeTimeString } from "./utils.js";
import { BackupRestoredEvent } from "./events.js";

class AppBackups extends LitElement {
  static properties = {
    backups: { type: Array },
    selectedBackup: { type: String },
    processing: { type: Boolean },
  };

  static styles = css`
    :host {
      display: grid;
      gap: 20px;
    }
  `;

  render() {
    this.style.justifyContent = this.backups ? "flex-start" : "center";

    if (!this.backups) {
      return html`<app-loader></app-loader>`;
    }

    return html`
      <app-heading level="2"
        >Backups <app-badge>${this.backups.length}</app-badge></app-heading
      >
      <app-table id="backups">
        <app-thead>
          <app-tr>
            <app-th></app-th>
            <app-th>Date</app-th>
            <app-th>Name</app-th>
            <app-th>Rows</app-th>
            <app-th>Size</app-th>
            <app-th>Action</app-th>
          </app-tr>
        </app-thead>
        <app-tbody>
          ${this.backups.map(
            (backup) => html`
              <app-tr
                selectable
                ?selected=${backup.name === this.selectedBackup}
                @click=${() => {
                  this.selectedBackup = backup.name;
                }}
              >
                <app-td highlighted no-wrap
                  >${getRelativeTimeString(
                    new Date(backup.last_modified)
                  )}</app-td
                >
                <app-td no-wrap>${backup.name}</app-td>
                <app-td>${backup['total_count']}</app-td>
                <app-td>${backup.size}</app-td>
                <app-td>
                  <app-button
                    ?disabled=${backup.name !== this.selectedBackup || this.processing}
                    @click=${() => this.#restore()}
                    >Restore</app-button
                  >
                </app-td>
              </app-tr>
            `
          )}
        </app-tbody>
      </app-table>
    `;
  }

  #restore() {
    this.processing = true;
    fetchJSON(`/restore/${this.selectedBackup}`, { method: "POST" })
      .then(() => this.dispatchEvent(new BackupRestoredEvent()))
      .catch((err) =>
        this.dispatchEvent(new AppErrorEvent("Unable to create backup", err))
      )
      .finally(() => {
        this.processing = false;
      });
  }
}

window.customElements.define("app-backups", AppBackups);
