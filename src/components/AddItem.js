import { css, html, LitElement } from 'lit';
import db from '../api/db.js';

export class AddItem extends LitElement {
  static get properties() {
    return {
      open: { type: Boolean },
      link: { type: Object },
      categories: { type: Array, state: true },
    };
  }

  constructor() {
    super();
    this.open = false;
    this.categories = [];

    this.loadCategories();
  }

  async loadCategories() {
    try {
      const categories = await db.categories.toArray();

      this.categories = categories;
    } catch (err) {
      console.error(err);
    }
  }

  attributeChangedCallback(at, _ol, ne) {
    if (at == 'open' && ne == 'true') {
      this.renderRoot.querySelector('dialog').showModal();
    }
  }

  saveItem(evt) {
    evt.preventDefault();
    const form = new FormData(evt.target);
    const detail = { name: form.get('name'), url: form.get('url') };

    if (this.link.id) {
      detail.id = this.link.id;
    }

    if (detail.url) {
      const event = new CustomEvent('save', {
        bubbles: true,
        composed: true,
        detail,
      });

      this.dispatchEvent(event);
      this.renderRoot.querySelector('dialog').close();
    }
  }

  close() {
    this.renderRoot.querySelector('dialog').close();
    const event = new Event('close', { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <dialog>
        <form action="submit" @submit="${this.saveItem}">
          <label for="name">name</label>
          <input type="text" name="name" value="${this.link?.name}">

          <label for="url">url</label>
          <input type="text" name="url" value="${this.link?.url}">

          <select name="categories">
            <option value=""></option>
            ${
      this.categories.map((cat) =>
        html`<option value="${cat.id}">${cat.name}</option>`
      )
    }
          </select>

          <button type="button" @click="${this.close}">cancel</button>
          <button type="submit">save</button>
        </form>
      </dialog>
    `;
  }

  static get styles() {
    return css``;
  }
}

window.customElements.define('add-item', AddItem);
