import { css, html, LitElement } from 'lit';

import './components/CategoryList.js';
import './components/AddBookmark.js';
import './components/AddCategory.js';

import { BookmarksController } from './controllers/bookmarks.js';

export class QuickDial extends LitElement {

  // controllers
  bookmarksController = new BookmarksController(this);

  static get properties() {
    return {
      categories: { type: Array, state: true },
    };
  }

  constructor() {
    super();
    this.loading = false;
    this.categories = [];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  async firstUpdated() {
    this.categories = await this.bookmarksController.getFolders();
  }

  editBookmark(evt) {
    const { parentId, bookmark } = evt.detail;
    const modal = this.shadowRoot.querySelector('add-bookmark');

    modal.open(parentId, bookmark);
  }

  async saveBookmark(evt) {
    try {
      const { id, title, url, parentId } = evt.detail;
      this.bookmarksController.save({ id, title, url, parentId });
    } catch (err) {
      console.error(err);
    }
  }

  async deleteBookmark(evt) {
    try {
      const { id } = evt.detail;
      this.bookmarksController.delete(id);
    } catch (err) {
      console.error(err);
    }
  }

  async saveCategory(evt) {
    try {
      const { category } = evt.detail;
      this.bookmarksController.save(category);
    } catch (err) {
      console.error(err);
    }
  }

  editCategory(evt) {
    evt.preventDefault();
    const { category } = evt.detail;

    const modal = this.shadowRoot.querySelector('add-category');
    modal.open(category);
  }

  async deleteCategory(evt) {
    try {
      this.bookmarksController.delete(id);
    } catch (err) {
      console.error(err);
    }
  }

  openAddBookmark(evt) {
    evt.preventDefault();
    const { parentId } = evt.detail;
    const modal = this.shadowRoot.querySelector('add-bookmark');
    modal.open(parentId);
  }

  openAddCategory(evt) {
    evt.preventDefault();
    const modal = this.shadowRoot.querySelector('add-category');
    modal.open();
  }

  render() {
    return html`
      <header>
        <a href="#" id="newCat" @click="${this.openAddCategory}">add category</a>
      </header>

      ${this.loading ? html`<div class="loading">Loading...</div>` : ''}

      <main>
      ${this.categories.length > 0
        ? this.categories.map((category) =>
          html`<category-list 
          .category=${category}
          data-id=${category.name}
          @editCategory=${this.editCategory} 
          @deleteCategory=${this.deleteCategory} 
          @addBookmark=${this.openAddBookmark}
          @editBookmark=${this.editBookmark}
          @deleteBookmark=${this.deleteBookmark}
        >
        </category-list>`
        )
        : ''
      }
    </main>

    <add-bookmark 
      @save="${this.saveBookmark}" 
      open=${this.bookmarksController.bookmarkModal}
    ></add-bookmark>
    
    <add-category 
      @save=${this.saveCategory}
      open=${this.addCategory}
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
