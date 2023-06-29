import { css, html, LitElement } from 'lit';

import './QuickItem.js';

import db from '../api/db.js';

export class CategoryList extends LitElement {
  static get properties() {
    return {
      links: { type: Array, state: true },
      category: { type: Object },
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

    this.getLinks();
  }

  attributeChangedCallback(at, _ol, ne) {
    console.log(at, _ol, ne);
    if (at == 'category') {
      this.getLinks();
    }
  }

  async getLinks() {
    try {
      this.loading = true;
      const data = await db.select({
        from: 'links',
        order: {
          by: 'order',
        },
        where: {
          cat_id: this.category.id,
        },
      });
      this.links = data;
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  _editCategory() {
    const event = new CustomEvent('edit', {
      detail: this.category,
      bubbles: true,
      composed: true,
    });

    console.log(this.category);

    this.dispatchEvent(event);
  }

  _deleteCategory() {
    const event = new CustomEvent('delete', {
      detail: this.category,
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  }

  render() {
    return html`
      <section class="category" draggable="true">
        <header>
          <h3>${this.category.order} : ${this.category.name}</h3>
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
          html`<quick-item .link=${link}></quick-item>`
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
