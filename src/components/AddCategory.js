import { css, html, LitElement } from 'lit';
import { live } from 'lit/directives/live.js';
import { validate } from 'validate.js';

export class AddCategory extends LitElement {
  static get properties() {
    return {
      open: { type: Boolean },
      category: { type: Object },
      error: { type: Object, state: true },
    };
  }

  constructor() {
    super();
    this.open = false;
    this.error = null;
    this.category = {};
  }

  attributeChangedCallback(at, _ol, ne) {
    if (at == 'open' && ne == 'true') {
      this.renderRoot.querySelector('dialog').showModal();
      // } else {
      //   console.log(at, ne);
    }
  }

  willUpdate(changedProperties) {
    console.log(changedProperties);
  }

  saveCategory(evt) {
    evt.preventDefault();
    const form = new FormData(evt.target);
    const detail = { name: form.get('name') };

    if (Number.isInteger(this.category?.id)) {
      detail.id = this.category.id;
    }

    this.error = validate({ name: detail.name }, {
      name: { presence: { allowEmpty: false } },
    });

    if (!this.error) {
      const event = new CustomEvent('save', {
        bubbles: true,
        composed: true,
        detail,
      });

      this.category = { id: null, name: '' };

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
      ${
      this.error
        ? html`<div class="error">
        Error : ${this.error.name.map((e) => html`${e} `)}
      </div>`
        : ''
    }
      <dialog>
        <form action="submit" @submit="${this.saveCategory}">
          <label for="name">name</label>
          <input type="text" name="name" .value="${live(this.category?.name)}">

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

window.customElements.define('add-category', AddCategory);
