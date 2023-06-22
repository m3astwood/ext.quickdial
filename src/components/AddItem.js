import { css, html, LitElement } from 'lit';
import db from '../api/db.js';
import { validate } from 'validate.js';

export class AddItem extends LitElement {
  static get properties() {
    return {
      open: { type: Boolean },
      link: { type: Object },
      dialog: { type: Object },
      categories: { type: Array, state: true },
      error: { type: Object, state: true },
    };
  }

  constructor() {
    super();
    this.open = false;
    this.categories = [];
    this.error = null;

    this.loadCategories();
  }

  async loadCategories() {
    try {
      const categories = await db.select({
        from: 'categories',
      });

      this.categories = categories;
    } catch (err) {
      console.error(err);
    }
  }

  attributeChangedCallback(at, _ol, ne) {
    if (at == 'open' && ne == 'true') {
      this.loadCategories();
      this.renderRoot.querySelector('dialog').showModal();
    } else {
      console.log(at, ne);
    }
  }

  saveItem(evt) {
    evt.preventDefault();
    const form = new FormData(evt.target);
    const detail = {
      name: form.get('name'),
      url: form.get('url'),
    };

    if (form.get('cat_id')) {
      detail.cat_id = parseInt(form.get('cat_id'));
    }

    if (this.link?.id) {
      detail.id = this.link.id;
    }

    this.error = validate({ url: detail.url }, {
      url: { presence: { allowEmpty: false }, url: { allowLocal: true } },
    });

    if (!this.error) {
      const event = new CustomEvent('save', {
        bubbles: true,
        composed: true,
        detail,
      });

      this.link = { id: null, name: '', url: '' };

      this.dispatchEvent(event);
      this.close();
    } else {
      console.error(this.error);
    }
  }

  close() {
    this.renderRoot.querySelector('dialog').close();
    const event = new Event('close', { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }

  render() {
    return html`
      ${
      this.error
        ? html`<div class="error">
        Error : ${this.error.url.map((e) => html`${e} `)}
      </div>`
        : ''
    }
      <dialog>
        <form action="submit" @submit="${this.saveItem}">
          <label for="name">name</label>
          <input type="text" name="name" value="${this.link?.name}">

          <label for="url">url</label>
          <input type="text" name="url" value="${this.link?.url}">

          <select name="cat_id">
            <option value=""></option>
            ${
      this.categories.map((cat) =>
        html`<option value="${cat.id}" ?selected=${
          cat.id == this.link?.cat_id
        }>${cat.name}</option>`
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
    return css`
      .error {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        width: calc(100vw - 4em);
        background-color: darkred;
        padding: 1em;
        margin: 1em;
        color: white;
      }
    `;
  }
}

window.customElements.define('add-item', AddItem);
