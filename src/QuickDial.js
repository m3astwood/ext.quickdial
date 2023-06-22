import { css, html, LitElement } from 'lit';
import './components/QuickItem.js';
import './components/AddItem.js';
import './components/AddCategory.js';

import db from './api/db.js';

export class QuickDial extends LitElement {
  static get properties() {
    return {
      links: { type: Array, state: true },
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
    this.links = [];
    this.categories = [];
    this.editableLink = { id: null, name: '', url: '' };
    this.editableCategory = { id: null, name: '' };
    this.addItem = false;
    this.addCategory = false;
  }

  connectedCallback() {
    super.connectedCallback();

    this.getLinks();
  }

  async saveItem(evt) {
    const { id, url, name, cat_id } = evt.detail;
    this.editableLink = { id: null, name: '', url: '', cat: -1 };
    try {
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
      this.getLinks();
    }
  }

  async getLinks() {
    try {
      this.loading = true;
      const data = await db.select({
        from: 'categories',
        join: {
          with: 'links',
          on: 'links.cat_id=categories.id',
          as: {
            id: 'link_id',
            name: 'link_name',
          },
        },
        groupBy: 'cat_id',
        aggregate: {
          list: [ 'link_name', 'url', 'link_id' ],
        },
      });
      console.log(data);
      this.links = data;
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
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
      this.getLinks();
    } catch (err) {
      console.error(err);
    }
  }

  async saveCategory(evt) {
    const { id, name } = evt.detail;
    try {
      if (id) {
        await db.update({
          in: 'categories',
          set: {
            name,
          },
          where: { id: parseInt(id) },
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
      this.getLinks();
    }
  }

  editCategory(evt) {
    const category = { ...evt.target.dataset };
    console.log(category);
    this.editableCategory = { ...category };
    this.openAddCategory(evt);
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

  renderLinks(idList, nameList, urlList, category) {
    return html`
      ${
      nameList.map((name, idx) =>
        html`<quick-item 
          id=${idList[idx]} 
          url=${urlList[idx]} 
          name=${name}
          cat_id=${category}
          @delete="${this.deleteLink}"
          @edit="${this.editLink}"
        ></quick-item>`
      )
    }
    `;
  }

  render() {
    return html`
      <header>
        <a href="#" @click="${this.openAddItem}">add item</a> |
        <a href="#" @click="${this.openAddCategory}">add category</a>
      </header>
      <main>
      ${this.loading ? html`<div class="loading">Loading...</div>` : ''}
      ${
      this.links.map((category) =>
        html`
      <section class="category">
        <header>
          <h3>${category.name}</h3>
          <button @click=${this.editCategory} data-id=${category.id} data-name=${category.name}>edit</button>
          <button @click=${this.deleteCategory}>delete</button>
        </header>
        ${
          this.renderLinks(
            category['list(link_id)'],
            category['list(link_name)'],
            category['list(url)'],
            category.id,
          )
        }
        </section>
      `
      )
    }
    </main>

    <add-item 
      @save="${this.saveItem}" 
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
      padding: 1em;
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

    main header {
      border-block-end: thin solid currentColor;
      padding-block-end: 1em;
    }
    `;
  }
}

window.customElements.define('quick-dial', QuickDial);
