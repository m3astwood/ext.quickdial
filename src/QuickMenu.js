import { css, html, LitElement } from 'lit';
import { BookmarksController } from './controllers/bookmarks.js';

class QuickMenu extends LitElement {
  bookmarksController = new BookmarksController(this);
  static get properties() {
    return {
      categories: { type: Array, state: true },
      parentId: { type: String, state: true }
    };
  }

  constructor() {
    super();
    this.categories = [];
    this.parentId = '';
  }

  async firstUpdated() {
    this.categories = await this.bookmarksController.getFolders();
  }

  async saveTab() {
    try {
      const [ ct ] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!ct) throw new Error('No current tab data found');

      const { url, title } = ct;

      console.log({ url, title, parentId: this.parentId });

      this.bookmarksController.save({ url: ct.url, title: ct.title, parentId: this.parentId });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return this.categories.length > 0 ?
    html`
      <select @change=${e => this.parentId = e.target.value}>
        <option> - select - </option>
        ${this.categories.map(c => html`<option value=${c.id} name=${c.title}>${c.title}</option>`)}
      </select>
      <hr>
      <button @click="${this.saveTab}">add to quickdial</button>
    ` : html`<span>No categories in quickdial</span>`;
  }

  static get styles() {
    return css`
      :host {
        font-family: sans-serif;
        display: grid;
        grid-auto-flow: row;
        gap: 0.125em;
      }

      hr {
        width: 100%;
        border: 0px;
        border-bottom: thin solid grey;
      }

      button {
        border: none;
        background: none;
        color: inherit;
        cursor: pointer;
      }

      button:hover {
        text-decoration: underline;
      }
    `;
  }
}

window.customElements.define('quick-menu', QuickMenu);
