import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
import { getRelativeTimeString } from "./utils.js";

class AppBackups extends LitElement {
  static properties = {
    backups: { type: Array },
    selectedBackup: { type: String },
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
      <app-heading level="2">Backups</app-heading>
      <app-table id="backups">
        <app-thead>
          <app-tr>
            <app-th></app-th>
            <app-th>Date</app-th>
            <app-th>Name</app-th>
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
                <app-td>${backup.size}</app-td>
                <app-td>
                  <form method="post" action="/restore/${backup.name}">
                    <app-button type="submit" ?disabled=${backup.name !== this.selectedBackup} class="restore"
                      >Restore</app-button
                    >
                  </form>
                </app-td>
              </app-tr>
            `
          )}
        </app-tbody>
      </app-table>
    `;
  }
}

window.customElements.define("app-backups", AppBackups);
