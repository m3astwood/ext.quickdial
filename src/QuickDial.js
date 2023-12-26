import { css, html, LitElement, unsafeCSS } from 'lit';
import Sortable from 'sortablejs';

import './components/CategoryList.js';
import './components/AddBookmark.js';
import './components/AddCategory.js';

import baseStyles from '../public/index.css';

import { BookmarksController } from './controllers/bookmarks.js';
import { ErrorController } from './controllers/errors.js';

export class QuickDial extends LitElement {

  // controllers
  bookmarksController = new BookmarksController(this);
  errorController = new ErrorController(this);

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

  async firstUpdated() {
    this.categories = await this.bookmarksController.getFolders();

    const mainEl = this.shadowRoot.querySelector('main');
    Sortable.create(mainEl, {
      animation: 150,
      onEnd: async ({ item, newIndex }) => {
        let cat = item.attributes.getNamedItem('category');
        if (cat) {
          cat = JSON.parse(cat.value);
          await this.bookmarksController.move(cat.id, newIndex);
        }
      }
    });
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
      const { id } = evt.detail;
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
        <a href="#" id="newCat" @click=${this.openAddCategory}>add category</a>
      </header>

      ${this.loading ? html`<div class="loading">Loading...</div>` : ''}

      <main>
          ${this.categories?.map((category) =>
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
        )}
      </main>

      <!-- modals -->
      <add-bookmark
        @save="${this.saveBookmark}"
        open=${this.bookmarksController.bookmarkModal}
      ></add-bookmark>

      <add-category
        @save=${this.saveCategory}
        open=${this.addCategory}
      ></add-category >

      ${this.errorController?.errors.length > 0 ?
      html`<div class='error-container'>
        ${this.errorController?.errors.map(err => html`<error-popup message=${err.message}></error-popup>`)}
      </div>`
      : ''
      }
    `;
  }

  static get styles() {
    return [ unsafeCSS(baseStyles), css`
:host {
  display: block;
}

.error-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  display: flex;
  flex-direction: column-reverse;
}

header {
  display: flex;
  align-items: center;
  margin-block-end: 1em;
  gap: 0.5em;
}

header > a:first-of-type {
  margin-inline-start: auto;
}

h2, h3 {
  margin-block: 0;
}

main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(30em, 100%), 1fr));
  gap: 1em;
}
` ];
  }
}

window.customElements.define('quick-dial', QuickDial);
