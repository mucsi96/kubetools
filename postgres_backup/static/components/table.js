import {
  LitElement,
  css,
  html,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

class AppTable extends LitElement {
  static styles = css`
    :host {
      display: table;
      border-collapse: collapse;
      text-align: left;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

class AppTableHead extends LitElement {
  static styles = css`
    :host {
      display: table-header-group;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

class AppTableBody extends LitElement {
  static styles = css`
    :host {
      display: table-row-group;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

class AppTableRow extends LitElement {
  static styles = css`
    :host {
      display: table-row;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

class AppTableHeadCell extends LitElement {
  static styles = css`
    :host {
      display: table-cell;
      padding: 12px 24px;
      font-weight: 600;
      background-color: rgb(55, 65, 81);
      color: rgb(156, 163, 175);
      text-transform: uppercase;
    }
  `;

  render() {
    return html`<slot></slot>`;
  }
}

class AppTableCell extends LitElement {
  static styles = css`
    :host {
      display: table-cell;
      padding: 12px 24px;
      font-weight: 500;
      background-color: rgb(31, 41, 55);
      border-bottom: 1px solid rgb(55, 65, 81);
    }

    :host([highlighted]) {
      color: white;
    }
  `;

  static properties = {
    highlighted: { type: Boolean },
  };

  render() {
    return html`<slot></slot>`;
  }
}

window.customElements.define("app-table", AppTable);
window.customElements.define("app-thead", AppTableHead);
window.customElements.define("app-tbody", AppTableBody);
window.customElements.define("app-tr", AppTableRow);
window.customElements.define("app-th", AppTableHeadCell);
window.customElements.define("app-td", AppTableCell);
