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
      addItem: { type: Boolean, state: true },
      addCategory: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.loading = false;
    this.links = [];
    this.categories = [];
    this.editableLink = {};
    this.addItem = false;
    this.addCategory = false;
  }

  connectedCallback() {
    super.connectedCallback();
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
              cat_id: cat_id ? cat_id : -1,
            },
          ],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.addItem = false;
    }
  }

  async getLinks() {
    try {
      this.loading = true;
      const data = await db.select({
        from: 'links',
      });
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
    this.addItem = true;
  }

  async deleteLink(evt) {
    const { id } = evt.detail;
    try {
      await db.remove({ from: 'links', where: { id: parseInt(id) } });
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
          where: { id: parseInt(id) }, {
        });
      } else {
        await db.insert({
          into: 'categories',
          values: [
            {
              name: name,
            }
          ]
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      this.addCategory = false;
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
        <h2>Quick Dial</h2>
        <a href="#" @click="${this.openAddItem}">add item</a> |
        <a href="#" @click="${this.openAddCategory}">add category</a>
      </header>
      ${this.loading ? html`<div class="loading">Loading...</div>` : ''}
      ${this.links.map((link) =>
      html`
        <quick-item 
          id="${link.id}" 
          url="${link.url}" 
          name="${link.name}"
          @edit="${this.editLink}"
          @delete="${this.deleteLink}"
        ></quick-item>`
    )
      }

    <add-item 
      @save="${this.saveItem}" 
                  @close="${this.closeAddItem}"
      open=${this.addItem}
      .link=${this.editableLink}
    ></add-item >
    
    <add-category 
      @save="${this.saveCategory}" 
      @close="${this.closeAddCategory}"
      open=${this.addCategory}
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

    h2 {
      margin-block-end: 0;
      line-height: 1;
      margin-inline-end: auto;
    }`;
  }
}

window.customElements.define('quick-dial', QuickDial);
