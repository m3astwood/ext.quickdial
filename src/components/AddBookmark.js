import { css, html, LitElement, unsafeCSS } from 'lit';
import { live } from 'lit/directives/live.js';
import { validate } from 'validate.js';
import { BookmarksController } from '../controllers/bookmarks';
import '../components/ErrorPopup';

import baseStyles from '../../public/index.css?inline';

export class AddBookmark extends LitElement {
  bookmarksController = new BookmarksController(this);

  static get properties() {
    return {
      // open: { type: Boolean },
      bookmark: { type: Object, reflect: true },
      dialog: { type: Object },
      categories: { type: Array, state: true },
      error: { type: Object, state: true },
    };
  }

  constructor() {
    super();
    this.categories = [];
    this.bookmark = { title: '', url: '', parentId: '' };
  }

  async getCategories() {
    this.categories = await this.bookmarksController.getFolders();
  }

  saveBookmark(evt) {
    evt.preventDefault();

    const validationError = validate({ url: this.bookmark.url }, {
      url: { presence: { allowEmpty: false }, url: { allowLocal: true } },
    });

    if (!validationError) {
      const event = new CustomEvent('save', {
        bubbles: true,
        composed: true,
        detail: this.bookmark,
      });

      this.bookmark = { id: null, title: '', url: '' };

      this.dispatchEvent(event);
      this.close();
    } else {
      const error = new Error(validationError.url.join(', '));
      const event = new CustomEvent('error', {
        bubbles: true,
        composed: true,
        detail: { error }
      });

      this.dispatchEvent(event);
    }
  }

  close() {
    this.renderRoot.querySelector('dialog').close();
    const event = new Event('close', { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }

  open(parentId, bookmark) {
    this.bookmark = {
      parentId,
      id: bookmark?.id ?? '',
      title: bookmark?.title ?? '',
      url: bookmark?.url ?? ''
    };

    this.getCategories();

    this.renderRoot.querySelector('dialog').showModal();
  }

  render() {
    return html`
      <dialog>
        <form @submit="${this.saveBookmark}">
          <label for="title">title</label>
          <input type="text" title="title" .value="${live(this.bookmark?.title)}" @input=${evt => this.bookmark.title = evt.target.value}>

          <label for="url">url</label>
          <input type="text" title="url" .value="${live(this.bookmark?.url) ?? ''}" @input=${evt => this.bookmark.url = evt.target.value}>

          <select @change=${evt => this.bookmark.parentId = evt.target.value} .value=${this.bookmark.parentId}>
            ${this.categories.map(c => html`<option value=${c.id}>${c.title}</option>`)}
          </select>

          <button type="button" @click="${this.close}">cancel</button>
          <button type="submit">save</button>
        </form>
      </dialog>
    `;
  }

  static get styles() {
    return [unsafeCSS(baseStyles), css`

    `];
  }
}

window.customElements.define('add-bookmark', AddBookmark);
