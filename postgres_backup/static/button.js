class AppButton extends HTMLElement {
  #fragment = document.createDocumentFragment();
  #style = document.createElement("style");
  #button = document.createElement("button");

  static observedAttributes = ["disabled", "label"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.#initStyle();
    this.#fragment.appendChild(this.#style);
    this.#fragment.appendChild(this.#button);
    this.shadowRoot.appendChild(this.#fragment);
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  get label() {
    return this.getAttribute("label");
  }

  set label(value) {
    this.setAttribute(value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "label":
        this.#button.textContent = this.label;
      case "disabled":
        this.#button.disabled = this.disabled;
    }
  }

  connectedCallback() {
    this.observedAttributes.forEach((attribute) =>
      this.attributeChangedCallback(attribute)
    );
  }

  #initStyle() {
    this.#style.innerHTML = `
      button {
        background-color: rgb(28, 100, 242);
        border: 1px solid rgb(28, 100, 242);
        padding: 10px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
      }
      
      button:not(:disabled):hover {
        background-color: rgb(26, 86, 219);
        border: 1px solid rgb(26, 86, 219);
        cursor: pointer;
      }
      
      button:disabled {
        background-color: rgb(31, 41, 55);
        color: rgb(156, 163, 175);
        border: 1px solid rgb(75, 85, 99);
      }`;
  }
}

window.customElements.define("app-button", AppButton);
