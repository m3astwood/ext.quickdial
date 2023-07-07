import { css, html, LitElement } from 'lit';

import './QuickItem.js';

import { liveQuery } from 'dexie';
import db from '../api/db.js';

export class CategoryList extends LitElement {
  static get properties() {
    return {
      links: { type: Array, state: true },
      category: { type: Object, reflect: true },
      loading: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();
    this.category = {};
    this.links = [];
    this.loading = false;
  }

  connectedCallback() {
    super.connectedCallback();

    const linkObservable = liveQuery(() =>
      db.links
        .where('cat_id')
        .equals(this.category.id)
        .toArray()
    );

    linkObservable.subscribe({
      next: (result) => this.links = result,
      error: (error) => console.error(error),
    });
  }

  _editCategory() {
    const event = new CustomEvent('editCategory', {
      detail: this.category,
      bubbles: true,
      composed: true,
    });

    console.log(this.category);

    this.dispatchEvent(event);
  }

  _deleteCategory() {
    const event = new CustomEvent('deleteCategory', {
      detail: this.category,
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  }

  _addLink() {
    const event = new CustomEvent('addLink', {
      detail: { id: this.category.id },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  }

  render() {
    return html`
      <section class="category" draggable="true">
        <header>
          <h3>${this.category.name}</h3>
          <a href="#" @click="${this._addLink}">add link</a> | 
          <button @click=${this._editCategory} data-id=${this.category.id} data-name=${this.category.name}>edit</button>
          ${
      this.category.id != 0
        ? html`
          <button @click=${this._deleteCategory} data-id=${this.category.id}>delete</button>
          `
        : ''
    }
        </header>

        ${
      this.links?.length > 0
        ? this.links.map((link) =>
          html`<quick-item 
            .link=${link}
          ></quick-item>`
        )
        : 'no links'
    }
      </section>
    `;
  }

  static get styles() {
    return css`
    header {
      display: flex;
      align-items: end;
      margin-block-end: 1em;
      gap: 0.25em;
      border-block-end: thin solid currentColor;
      padding-block-end: 1em;
    }

    header > a:first-of-type {
      margin-inline-start: auto;
    }

    h2, h3 {
      margin-block-end: 0;
      line-height: 1;
      margin-inline-end: auto;
    }

`;
  }
}

window.customElements.define('category-list', CategoryList);
