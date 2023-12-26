import { css, html, LitElement, unsafeCSS } from 'lit';
import { live } from 'lit/directives/live.js';
import { validate } from 'validate.js';

import baseCss from '../../public/index.css?inline';

export class AddCategory extends LitElement {
  static get properties() {
    return {
      category: { type: Object, reflect: true },
    };
  }

  constructor() {
    super();
    this.category = {};
  }

  saveCategory(evt) {
    evt.preventDefault();

    const validationError = validate({ title: this.category.title }, {
      title: { presence: { allowEmpty: false } },
    });

    if (!validationError) {
      const event = new CustomEvent('save', {
        bubbles: true,
        composed: true,
        detail: {
          category: this.category
        },
      });

      this.category = {};

      this.dispatchEvent(event);
      this.close();
    } else {
      const error = new Error(validationError.title.join(', '));
      const event = new CustomEvent('error', {
        bubbles: true,
        composed: true,
        detail: { error }
      });

      this.dispatchEvent(event);
    }
  }

  close() {
    this.renderRoot.querySelector('dialog').close();
    const event = new Event('close', { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }

  open(category) {
    this.category = {
      id: category?.id ?? '',
      title: category?.title ?? '',
    };

    this.shadowRoot.querySelector('dialog').showModal();
  }

  render() {
    return html`
      <dialog>
        <form action="submit" @submit="${this.saveCategory}">
          <label for="title">title</label>
          <input type="text" title="title" .value="${live(this.category?.title)}" @input=${evt => this.category.title = evt.target.value}>

          <button type="button" @click="${this.close}">cancel</button>
          <button type="submit">save</button>
        </form>
      </dialog>
    `;
  }

  static get styles() {
    return [ unsafeCSS(baseCss), css`
    ` ];
  }
}

window.customElements.define('add-category', AddCategory);
