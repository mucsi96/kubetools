import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class AppTables extends LitElement {
  static properties = {
    tables: { type: Array },
  };

  static styles = css`
    :host {
        display: grid;
        gap: 20px;
        justify-content: flex-start;
    }
  `;

  render() {
    return html`
      <app-heading level="2">Tables</app-heading>
      <app-table>
        <app-thead>
          <app-tr>
            <app-th>Name</app-th>
            <app-th>Rows</app-th>
          </app-tr>
        </app-thead>
        <app-tbody>
          ${this.tables?.map(
            (table) => html`
              <app-tr>
                <app-td highlighted>${table.name}</app-td>
                <app-td>${table.count}</app-td>
              </app-tr>
            `
          )}
        </app-tbody>
      </app-table>
      <form method="post" action="/backup">
        <app-button label="Backup" type="submit"></app-button>
      </form>
    `;
  }
}

window.customElements.define("app-tables", AppTables);
