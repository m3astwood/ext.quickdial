import { css, html, LitElement } from 'lit';
import Sortable from 'sortablejs';

import './components/QuickItem.js';
import './components/CategoryList.js';
import './components/AddItem.js';
import './components/AddCategory.js';

import db from './api/db.js';

export class QuickDial extends LitElement {
  static get properties() {
    return {
      categories: { type: Array, state: true },
      editableLink: { type: Object, state: true },
      editableCategory: { type: Object, state: true },
      addItem: { type: Boolean, state: true },
      addCategory: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.loading = false;
    this.categories = [];
    this.editableLink = { id: null, name: '', url: '' };
    this.editableCategory = { id: null, name: '' };
    this.addItem = false;
    this.addCategory = false;
  }

  connectedCallback() {
    super.connectedCallback();

    this.getCategories();
  }

  firstUpdated() {
    const categories = this.shadowRoot.querySelector('main');
    Sortable.create(categories, {
      group: 'quickdial-categories',
      handle: 'header',
      easing: 'ease',
      animation: 250,
      onEnd: (evt) => {
        console.log(evt.oldIndex, evt.newIndex);
        this.setOrder(evt.oldIndex, evt.newIndex);
      },
    });
  }

  async setOrder(oldIdx, newIdx) {
    try {
      const [ movedItem ] = await db.select({
        from: 'categories',
        where: {
          order: oldIdx,
        },
      });

      console.log(movedItem);

      let reorder = { '+': 1 };

      if (oldIdx > newIdx) {
        reorder = { '-': 1 };
      }

      console.log(reorder);

      await db.update({
        in: 'categories',
        set: {
          order: reorder,
        },
        where: {
          order: {
            '-': {
              low: oldIdx > newIdx ? newIdx - 1 : oldIdx,
              high: oldIdx > newIdx ? oldIdx : newIdx + 1,
            },
          },
        },
      });

      await db.update({
        in: 'links',
        set: {
          order: newIdx,
        },
        where: {
          id: movedItem.id,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  async getFavicon(url) {
    try {
      const req = await fetch(`${url}`, {
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });
      console.log(await req.text());
      return req;
    } catch (err) {
      console.error(err);
    }
  }

  async saveLink(evt) {
    const { id, url, name, cat_id } = evt.detail;
    this.editableLink = { id: null, name: '', url: '', cat: -1 };
    try {
      // const favicon = await this.getFavicon(url);
      if (id) {
        await db.update({
          in: 'links',
          set: {
            url,
            name,
            cat_id,
          },
          where: { id: parseInt(id) },
        });
      } else {
        await db.insert({
          into: 'links',
          values: [
            {
              name: name ? name : url,
              url,
              cat_id,
            },
          ],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.closeAddItem();
      this.getCategories();
    }
  }

  editLink(evt) {
    const { link } = evt.detail;
    console.log(link);
    this.editableLink = { ...link };
    this.openAddItem(evt);
  }

  async deleteLink(evt) {
    const { id } = evt.detail;
    try {
      await db.remove({
        from: 'links',
        where: { id: parseInt(id) },
      });
      this.getCategories();
    } catch (err) {
      console.error(err);
    }
  }

  async getCategories() {
    try {
      this.loading = true;
      const data = await db.select({
        from: 'categories',
        order: {
          by: 'order',
        },
      });

      this.categories = [ ...data ];
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  async saveCategory(evt) {
    const { id, name } = evt.detail;
    try {
      if (Number.isInteger(id)) {
        await db.update({
          in: 'categories',
          set: {
            name,
          },
          where: { id: id },
        });
      } else {
        await db.insert({
          into: 'categories',
          values: [
            {
              name: name,
            },
          ],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.closeAddCategory();
      this.getCategories();
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
      await db.remove({
        from: 'categories',
        where: { id: parseInt(id) },
      });

      await db.update({
        in: 'links',
        set: {
          cat_id: 0,
        },
        where: {
          cat_id: parseInt(id),
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      this.getCategories();
    }
  }

  openAddItem(evt) {
    evt.preventDefault();
    this.addItem = true;
  }

  closeAddItem() {
    this.addItem = false;
    this.editableLink = { id: null, name: '', url: '' };
  }

  openAddCategory(evt) {
    evt.preventDefault();
    this.addCategory = true;
  }

  closeAddCategory() {
    this.addCategory = false;
  }

  render() {
    return html`
      <header>
        <a href="#" @click="${this.openAddItem}">add item</a> |
        <a href="#" @click="${this.openAddCategory}">add category</a>
      </header>

      ${this.loading ? html`<div class="loading">Loading...</div>` : ''}

      <main>
      ${
      this.categories.map((category) =>
        html`<category-list 
          .category=${category}
          @edit=${this.editCategory} 
          @delete=${this.deleteCategory} 
          @editLink=${this.editLink}
          @deleteLink=${this.deleteLink}
        >
        </category-list>`
      )
    }
    </main>

    <add-item 
      @save="${this.saveLink}" 
      @close="${this.closeAddItem}"
      open=${this.addItem}
      .link=${this.editableLink}
    ></add-item >
    
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
