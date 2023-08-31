import { css, html, LitElement } from 'lit';
import { live } from 'lit/directives/live.js';
import { validate } from 'validate.js';

export class AddBookmark extends LitElement {
  static get properties() {
    return {
      open: { type: Boolean },
      bookmark: { type: Object, reflect: true },
      dialog: { type: Object },
      categories: { type: Array, state: true },
      error: { type: Object, state: true },
    };
  }

  constructor() {
    super();
    this.open = false;
    this.categories = [];
    this.bookmark = { title: '', url: '' };
    this.error = null;
  }

  attributeChangedCallback(at, _ol, ne) {
    if (at == 'open' && ne == 'true') {
      this.renderRoot.querySelector('dialog').showModal();
    }
  }

  saveItem(evt) {
    evt.preventDefault();

    console.log(this.bookmark);

    this.error = validate({ url: this.bookmark.url }, {
      url: { presence: { allowEmpty: false }, url: { allowLocal: true } },
    });

    if (!this.error) {
      const event = new CustomEvent('save', {
        bubbles: true,
        composed: true,
        detail: this.bookmark,
      });

      this.bookmark = { id: null, title: '', url: '' };

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
      ${this.error
        ? html`<div class="error">
        Error : ${this.error.url.map((e) => html`${e} `)}
      </div>`
        : ''
      }
      <dialog>
        <form @submit="${this.saveItem}">
          <label for="title">title</label>
          <input type="text" title="title" .value="${live(this.bookmark?.title)}" @input=${evt => this.bookmark.title = evt.target.value}>

          <label for="url">url</label>
          <input type="text" title="url" .value="${live(this.bookmark?.url) ?? ''}" @input=${evt => this.bookmark.url = evt.target.value}>

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

window.customElements.define('add-bookmark', AddBookmark);
