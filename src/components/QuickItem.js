import { css, html, LitElement } from 'lit';

export class QuickItem extends LitElement {
  static get properties() {
    return {
      id: { type: String },
      url: { type: String },
      name: { type: String },
    };
  }

  constructor() {
    super();
    this.name = null;
    this.url = null;
  }

  delete() {
    const event = new CustomEvent('delete', {
      bubbles: true,
      composed: true,
      detail: {
        id: this.id,
      },
    });

    this.dispatchEvent(event);
  }

  edit() {
    const event = new CustomEvent('edit', {
      bubbles: true,
      composed: true,
      detail: {
        link: {
          id: this.id,
          url: this.url,
          name: this.name,
        },
      },
    });

    this.dispatchEvent(event);
  }

  render() {
    return html`
      <div class="item" id="link-${this.id}">
        <a href="${this.url}">
          ${this.name ? this.name : this.url}
        </a>

        <div class="controls">
          <button class="outline" @click="${this.edit}">edit</button>
          <button class="outline" @click="${this.delete}">delete</button>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .item {
        display: flex;
        padding-block: 0.5em;
        gap: 0.25em;
        align-items: center;
      }

      div > :first-child {
        margin-inline-end: auto;
      }
    `;
  }
}

window.customElements.define('quick-item', QuickItem);
