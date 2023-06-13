import { css, html, LitElement } from 'lit';

export class QuickItem extends LitElement {
  static get properties() {
    return {
      url: { type: String },
      name: { type: String },
    };
  }

  constructor() {
    super();
    this.name = null;
    this.url = null;
  }

  render() {
    return html`
      <div>
        <a href="${this.url}">
          ${this.name ? this.name : this.url}
        </a>
      </div>
    `;
  }

  static get styles() {
    return css``;
  }
}

window.customElements.define('quick-item', QuickItem);
