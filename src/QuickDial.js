import { css, html, LitElement } from 'lit';
import './components/QuickItem.js';
import './components/AddItem.js';

import { liveQuery } from 'dexie';
import db from './api/db.js';

export class QuickDial extends LitElement {
  static get properties() {
    return {
      links: { type: Array, state: true },
      editableLink: { type: Object, state: true },
      addItem: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.loading = false;
    this.links = [];
    this.editableLink = {};
    this.addItem = false;

    const linksObservable = liveQuery(() => db.links.toArray());
    linksObservable.subscribe({
      next: (data) => this.links = data,
      error: (err) => console.error(err),
    });
  }

  async saveItem(evt) {
    const { id, url, name } = evt.detail;
    this.editableLink = { id: null, name: '', url: '' };
    try {
      if (id) {
        await db.links.update(parseInt(id), {
          url,
          name,
        });
      } else {
        await db.links.add({
          name: name ? name : url,
          url,
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
      const data = await db.links.toArray();
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
      await db.links.delete(parseInt(id));
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return html`
      <h1>Quick Dial</h1>
      ${this.loading ? html`<div class="loading">Loading...</div>` : ''}
      ${
      this.links.map((link) =>
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
      <a href="#" @click="${this.openAddItem}">add item</a>
      <add-item 
        @save="${this.saveItem}" 
        @close="${this.closeAddItem}"
        open = ${this.addItem}
        .link = ${this.editableLink}
      ></add - item >
  `;
  }

  openAddItem(evt) {
    evt.preventDefault();
    this.addItem = true;
  }

  closeAddItem() {
    this.addItem = false;
    this.editableLink = { id: null, name: '', url: '' };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 1em;
      }

      h1 {
        margin: 0;
      }
    `;
  }
}

window.customElements.define('quick-dial', QuickDial);
