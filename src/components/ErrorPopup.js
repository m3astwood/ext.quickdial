import { LitElement, html, css } from 'lit';

class ErrorPopup extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      message: { type: String },
      status: { type: String }
    };
  }

  constructor() {
    super();
    this.title = 'Error';
    this.message = '';
    this.status = '';
  }

  render() {
    return html`
  <div class="error">
    ${this.title} ${this.status ?? `(${this.status})`}: ${this.message}
  </div>

`;
  }

  static get styles() {
    return css`
      .error {
        background-color: darkred;
        padding: 1em;
        margin: 0.25em 0.5em 0.5em;
        color: white;
      }
    `;
  }
}

window.customElements.define('error-popup', ErrorPopup);
