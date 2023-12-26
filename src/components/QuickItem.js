import { css, html, LitElement, unsafeCSS } from 'lit';

import baseStyles from '../../public/index.css?inline';

export class QuickItem extends LitElement {
  static get properties() {
    return {
      bookmark: { type: Object },
    };
  }

  constructor() {
    super();
    this.bookmark = { id: '', title: '', url: '' };

  }

  _delete() {
    const event = new CustomEvent('deleteBookmark', {
      bubbles: true,
      composed: true,
      detail: {
        id: this.bookmark.id,
      },
    });

    this.dispatchEvent(event);
  }

  _edit() {
    const event = new CustomEvent('editBookmark', {
      bubbles: true,
      composed: true,
      detail: {
        parentId: this.bookmark.parentId,
        bookmark: {
          id: this.bookmark.id,
          url: this.bookmark.url,
          title: this.bookmark.title,
        },
      },
    });

    this.dispatchEvent(event);
  }

  render() {
    return html`
      <div class="item" id="${this.bookmark.id}">
        <a href="${this.bookmark.url}">
          ${this.bookmark.title ? this.bookmark.title : this.bookmark.url}
        </a>

        <div class="controls">
          <button @click="${this._edit}">edit</button>
          <button class="delete" @click="${this._delete}">delete</button>
        </div>
      </div>
    `;
  }

  static get styles() {
    return [ unsafeCSS(baseStyles), css`
      .item {
        display: flex;
        padding-block: 0.5em;
        gap: 0.25em;
        align-items: center;
      }

      div > :first-child {
        margin-inline-end: auto;
      }
    ` ];
  }
}

window.customElements.define('quick-item', QuickItem);
