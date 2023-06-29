import { css, html, LitElement } from 'lit';

export class QuickItem extends LitElement {
  static get properties() {
    return {
      link: { type: Object },
    };
  }

  constructor() {
    super();
    this.link = {};
  }

  _delete() {
    const event = new CustomEvent('deleteLink', {
      bubbles: true,
      composed: true,
      detail: {
        id: this.link.id,
      },
    });

    this.dispatchEvent(event);
  }

  _edit() {
    const event = new CustomEvent('editLink', {
      bubbles: true,
      composed: true,
      detail: {
        link: {
          id: this.link.id,
          url: this.link.url,
          name: this.link.name,
          cat_id: this.link.cat_id,
        },
      },
    });

    this.dispatchEvent(event);
  }

  render() {
    return html`
      <div class="item" id="link-${this.link.id}">
        <a href="${this.link.url}">
          ${this.link.name ? this.link.name : this.link.url}
        </a>

        <div class="controls">
          <button class="outline" @click="${this._edit}">edit</button>
          <button class="outline" @click="${this._delete}">delete</button>
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
