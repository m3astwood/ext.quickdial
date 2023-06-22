import { css, html, LitElement } from 'lit';
import db from '../api/db.js';

export class AddCategory extends LitElement {
  static get properties() {
    return {
      open: { type: Boolean },
      category: { type: Object },
    };
  }

  constructor() {
    super();
    this.open = false;
  }

  attributeChangedCallback(at, _ol, ne) {
    if (at == 'open' && ne == 'true') {
      this.renderRoot.querySelector('dialog').showModal();
    } else {
      console.log(at, ne);
    }
  }

  saveCategory(evt) {
    evt.preventDefault();
    const form = new FormData(evt.target);
    const detail = { name: form.get('name') };

    if (this.link?.id) {
      detail.id = this.link.id;
    }

    if (detail.name) {
      const event = new CustomEvent('save', {
        bubbles: true,
        composed: true,
        detail,
      });

      this.link = { id: null, name: '' };

      this.dispatchEvent(event);
      this.close();
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
        <form action="submit" @submit="${this.saveCategory}">
          <label for="name">name</label>
          <input type="text" name="name" value="${this.link?.name}">

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

window.customElements.define('add-category', AddCategory);
