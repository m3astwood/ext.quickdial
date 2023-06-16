import { css, html, LitElement } from 'lit';
import './components/QuickItem.js';
import './components/AddItem.js';

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
    this.editableLink = { id: null, name: '', url: '' };
    this.addItem = false;

    this.getLinks();
  }

  async getLinks() {
    try {
      this.loading = true;
      const data = await db.select({ from: 'links' });
      console.log(data);
      this.links = data;
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  async saveItem(evt) {
    const { id, url, name } = evt.detail;
    try {
      if (id) {
        await db.update({
          in: 'links',
          set: {
            url,
            name,
          },
          where: { id: parseInt(id) },
        });
      } else {
        await db.insert({
          into: 'links',
          values: [ {
            name: name ? name : url,
            url,
          } ],
        });
      }
      this.editableLink = { id: null, name: '', url: '' };
      this.getLinks();
    } catch (err) {
      console.error(err);
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
      await db.remove({
        from: 'links',
        where: { id: parseInt(id) },
      });
      this.getLinks();
    } catch (err) {
      console.error(err);
    }
  }

  openAddItem(evt) {
    evt.preventDefault();
    this.addItem = true;
  }

  closeAddItem() {
    this.editableLink = { id: null, name: '', url: '' };
    this.addItem = false;
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
        open=${this.addItem}
        .link=${this.editableLink}
      ></add-item >
  `;
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
