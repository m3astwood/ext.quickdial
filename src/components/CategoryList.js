import { css, html, LitElement, unsafeCSS } from 'lit';

import './QuickItem.js';
import { BookmarksController } from '../controllers/bookmarks.js';

import baseStyles from '../../public/index.css?inline';

export class CategoryList extends LitElement {

  bookmarksController = new BookmarksController(this);

  static get properties() {
    return {
      bookmarks: { type: Array, state: true },
      category: { type: Object, reflect: true },
      loading: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.category = {};
    this.bookmarks = [];
    this.loading = false;
  }

  async firstUpdated() {
    await this.bookmarksController.getBookmarks(this.category.id);
  }

  _editCategory() {
    const event = new CustomEvent('editCategory', {
      bubbles: true,
      composed: true,
      detail: { category: this.category },
    });

    this.dispatchEvent(event);
  }

  _deleteCategory() {
    const event = new CustomEvent('deleteCategory', {
      detail: this.category,
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  }

  _addBookmark() {
    const event = new CustomEvent('addBookmark', {
      detail: { parentId: this.category.id },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  }

  render() {
    return html`
      <section class="category" draggable="true">
        <header>
          <h3>${this.category.title}</h3>
          <a href="#" @click="${this._addBookmark}">add bookmark</a>
          ${this.category.title != 'uncategorised'
        ? html`
          <button @click=${this._editCategory} data-id=${this.category.id} data-name=${this.category.title}>edit</button>
          <button class="delete" @click=${this._deleteCategory} data-id=${this.category.id}>delete</button>
          `
        : ''
      }
        </header>

        ${this.bookmarksController.list?.length > 0
        ? this.bookmarksController.list.map((bookmark) =>
          html`<quick-item
            .bookmark=${bookmark}
          ></quick-item>`
        )
        : 'no bookmarks'
      }
      </section>
    `;
  }

  static get styles() {
    return [ unsafeCSS(baseStyles), css`
    :host {
      padding-block: 0.75em;
    }

    header {
      display: flex;
      align-items: center;
      margin-block-end: 1em;
      gap: 0.5em;
      border-block-end: thin solid var(--bg-secondary, currentColor);
      padding-block-end: 1em;
    }

    header > a:first-of-type {
      margin-inline-start: auto;
    }

    h2, h3 {
      margin-block: 0;
      margin-inline-end: auto;
    }

` ];
  }
}

window.customElements.define('category-list', CategoryList);
