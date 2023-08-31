import { css, html, LitElement } from 'lit';

import './QuickItem.js';
import { BookmarksController } from '../controllers/bookmarks.js';

export class CategoryList extends LitElement {

  bookmarksController = new BookmarksController(this)

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

  connectedCallback() {
    super.connectedCallback();

    if (this.category.title == 'quickdial') {
      this.category.title = 'uncategorised'
    }
  }

  async firstUpdated() {
    this.bookmarks = await this.bookmarksController.getBookmarks(this.category.id);
  }

  _editCategory() {
    const event = new CustomEvent('editCategory', {
      detail: this.category,
      bubbles: true,
      composed: true,
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
      detail: { id: this.category.id },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  }

  render() {
    return html`
      <section class="category" draggable="true">
        <header>
<<<<<<< HEAD
          <h3>${this.category.order} : ${this.category.name}</h3>
          <a href="#" @click="${this._addLink}">add link</a> | 
          <button @click=${this._editCategory} data-id=${this.category.id} data-name=${this.category.name}>edit</button>
          ${
      this.category.id != 0
=======
          <h3>${this.category.title}</h3>
          <a href="#" @click="${this._addBookmark}">add bookmark</a>  
          ${this.category.title != 'uncategorised'
>>>>>>> fa530fa (through rewrite to save items to bookmarks over db)
        ? html`
          |
          <button @click=${this._editCategory} data-id=${this.category.id} data-name=${this.category.title}>edit</button>
          <button @click=${this._deleteCategory} data-id=${this.category.id}>delete</button>
          `
        : ''
      }
        </header>

        ${this.bookmarks?.length > 0
        ? this.bookmarks.map((bookmark) =>
          html`<quick-item 
            .bookmark=${bookmark}
          ></quick-item>`
        )
<<<<<<< HEAD
        : `no links in ${this.category.name}`
    }
=======
        : 'no bookmarks'
      }
>>>>>>> fa530fa (through rewrite to save items to bookmarks over db)
      </section>
    `;
  }

  static get styles() {
    return css`
    header {
      display: flex;
      align-items: end;
      margin-block-end: 1em;
      gap: 0.25em;
      border-block-end: thin solid currentColor;
      padding-block-end: 1em;
    }

    header > a:first-of-type {
      margin-inline-start: auto;
    }

    h2, h3 {
      margin-block-end: 0;
      line-height: 1;
      margin-inline-end: auto;
    }

`;
  }
}

window.customElements.define('category-list', CategoryList);
