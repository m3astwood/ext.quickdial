import { css, html, LitElement } from 'lit';

import './components/QuickItem.js';
import './components/CategoryList.js';
import './components/AddLink.js';
import './components/AddCategory.js';

import { liveQuery } from 'dexie';
import db from './api/db.js';

export class QuickDial extends LitElement {
  static get properties() {
    return {
      categories: { type: Array, state: true },
      editableLink: { type: Object, state: true },
      editableCategory: { type: Object, state: true },
      addLink: { type: Boolean, state: true },
      addCategory: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.loading = false;
    this.categories = [];
    this.editableLink = { id: null, name: '', url: '' };
    this.editableCategory = { id: null, name: '' };
    this.addLink = false;
    this.addCategory = false;
  }

  connectedCallback() {
    super.connectedCallback();

    const catObservable = liveQuery(() => db.categories.toArray());

    catObservable.subscribe({
      next: (result) => this.categories = result,
      error: (error) => console.error(error),
    });
  }

  async saveLink(evt) {
    const { id, url, name, cat_id } = evt.detail;
    this.editableLink = { id: null, name: '', url: '', cat: -1 };
    try {
      if (id) {
        await db.links.update(
          parseInt(id),
          {
            url,
            name,
            cat_id,
          },
        );
      } else {
        await db.links.add({
          name: name ? name : url,
          url,
          cat_id,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.closeAddLink();
    }
  }

  editLink(evt) {
    const { link } = evt.detail;
    this.editableLink = { ...link };
    this.openAddLink(evt);
  }

  async deleteLink(evt) {
    const { id } = evt.detail;
    try {
      await db.links.delete(
        parseInt(id),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async saveCategory(evt) {
    const { id, name } = evt.detail;
    try {
      console.log(id, name);
      if (Number.isInteger(id)) {
        await db.categories.update(
          id,
          {
            name,
          },
        );
      } else {
        await db.categories.add({
          name: name,
          order: this.categories.length,
        });
      }
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
      await db.categories.delete(
        parseInt(id),
      );

      await db.links.where('cat_id').equals(parseInt(id)).modify({
        cat_id: 0,
      });
    } catch (err) {
      console.error(err);
    }
  }

  openAddLink(evt) {
    evt.preventDefault();
    const { id } = evt.detail;
    if (!this.editableLink.id) {
      this.editableLink = { id: null, name: '', cat_id: id };
    }
    this.addLink = true;
  }

  closeAddLink() {
    this.addLink = false;
    this.editableLink = { id: null, name: '', url: '' };
  }

  openAddCategory(evt) {
    evt.preventDefault();
    if (evt.target.id == 'newCat') {
      this.editableCategory = { id: null, name: '' };
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
          @addLink=${this.openAddLink}
          @editLink=${this.editLink}
          @deleteLink=${this.deleteLink}
        >
        </category-list>`
    )
      }
    </main>

    <add-link 
      @save="${this.saveLink}" 
      @close="${this.closeAddLink}"
      open=${this.addLink}
      .link=${this.editableLink}
    ></add-link >
    
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
