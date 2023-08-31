import { css, html, LitElement } from 'lit';

import './components/QuickItem.js';
import './components/CategoryList.js';
import './components/AddBookmark.js';
import './components/AddCategory.js';

import { BookmarksController } from './controllers/bookmarks.js';

export class QuickDial extends LitElement {

  // controllers
  bookmarksController = new BookmarksController(this)

  static get properties() {
    return {
      categories: { type: Array, state: true },
      editableBookmark: { type: Object, state: true },
      editableCategory: { type: Object, state: true },
      addBookmark: { type: Boolean, state: true },
      addCategory: { type: Boolean, state: true },
      bookmarkRoot: { type: String, state: true }
    };
  }

  constructor() {
    super();
    this.loading = false;
    this.categories = [];
    this.editableBookmark = { id: null, title: '', url: '' };
    this.editableCategory = { id: null, title: '' };
    this.addBookmark = false;
    this.addCategory = false;
    this.bookmarkRoot = '';
  }

  connectedCallback() {
    super.connectedCallback();
  }

  async firstUpdated() {
    this.categories = await this.bookmarksController.getFolders();
  }

  editBookmark(evt) {
    const { bookmark } = evt.detail;
    this.editableBookmark = { ...bookmark };
    this.openAddBookmark(evt);
  }

  async saveBookmark(evt) {
    try {
      const { id, title, url } = evt.detail;
      this.bookmarksController.save({ id, title, url })
    } catch (err) {
      console.error(err)
    }
  }

  async deleteBookmark(evt) {
    try {
      const { id } = evt.detail;
      this.bookmarksController.delete(id)
    } catch (err) {
      console.error(err);
    }
  }

  async saveCategory(evt) {
    try {
      const { id, title } = evt.detail;
      this.bookmarksController.save({ id, title })
    } catch (err) {
      console.error(err);
    } finally {
      this.closeAddCategory();
    }
  }

  editCategory(evt) {
    const category = { ...evt.detail };
    this.editableCategory = { ...category };
    this.openAddCategory(evt);
  }

  async deleteCategory(evt) {
    const { id } = evt.detail;
    try {
      // try to delete
    } catch (err) {
      console.error(err);
    }
  }

  openAddBookmark(evt) {
    evt.preventDefault();
    if (!this.editableBookmark.id) {
      this.editableBookmark = { id: null, title: '' };
    }
    this.addBookmark = true;
  }

  closeAddBookmark() {
    this.addBookmark = false;
    this.editableBookmark = { id: null, title: '', url: '' };
  }

  openAddCategory(evt) {
    evt.preventDefault();
    if (evt.target.id == 'newCat') {
      this.editableCategory = { id: null, title: '' };
    }
    this.addCategory = true;
  }

  closeAddCategory() {
    this.addCategory = false;
  }

  render() {
    return html`
      <header>
        <a href="#" id="newCat" @click="${this.openAddCategory}">add category</a>
      </header>

      ${this.loading ? html`<div class="loading">Loading...</div>` : ''}

      <main>
      ${this.categories.map((category) =>
      html`<category-list 
          .category=${category}
          @editCategory=${this.editCategory} 
          @deleteCategory=${this.deleteCategory} 
          @addBookmark=${this.openAddBookmark}
          @editBookmark=${this.editBookmark}
          @deleteBookmark=${this.deleteBookmark}
        >
        </category-list>`
    )
      }
    </main>

    <add-bookmark 
      @save="${this.saveBookmark}" 
      @close="${this.closeAddBookmark}"
      open=${this.addBookmark}
      .bookmark=${this.editableBookmark}
    ></add-bookmark>
    
    <add-category 
      @save=${this.saveCategory}
      @close=${this.closeAddCategory}
      open=${this.addCategory}
      .category=${this.editableCategory}
    ></add-category >
  `;
  }

  static get styles() {
    return css`
    :host {
      display: block;
      margin-block-start: 5em;
      padding: 1em;
      width: min(100em, 100%);
     }

    header {
      display: flex;
      align-items: end;
      margin-block-end: 1em;
      gap: 0.25em;
    }

    header > a:first-of-type {
      margin-inline-start: auto;
    }

    h2, h3 {
      margin-block-end: 0;
      line-height: 1;
      margin-inline-end: auto;
    }

    main {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(30em, 100%), 1fr));
      gap: 1em;
    }

    `;
  }
}

window.customElements.define('quick-dial', QuickDial);
