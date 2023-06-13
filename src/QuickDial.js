import { css, html, LitElement } from 'lit';
import './components/QuickItem.js';
import './components/AddItem.js';

import { liveQuery } from 'dexie';
import db from './api/db.js';

export class QuickDial extends LitElement {
  static get properties() {
    return {
      links: { type: Array, state: true },
      addItem: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.loading = false;
    this.links = [];
    this.addItem = false;
    // this.getLinks();
    const linksObservable = liveQuery(() => db.links.toArray());
    linksObservable.subscribe({
      next: (data) => this.links = data,
      error: (err) => console.error(err),
    });
  }

  async saveItem(evt) {
    const { url, name } = evt.detail;
    try {
      await db.links.add({
        name: name ? name : url,
        url,
      });
    } catch (err) {
      console.error(err);
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

  render() {
    return html`
      <h2>Quick Dial</h2>
      ${this.loading ? html`<div class="loading">Loading...</div>` : ''}
      ${
      this.links.map((link) =>
        html`<quick-item url="${link.url}" name="${link.name}"></quick-item>`
      )
    }
      <a href="#" @click="${this.openAddItem}">add item</a>
      <add-item @save="${this.saveItem}" open=${this.addItem}></add-item>
    `;
  }

  openAddItem(evt) {
    evt.preventDefault();
    this.addItem = true;
  }

  static get styles() {
    return css``;
  }
}

window.customElements.define('quick-dial', QuickDial);
