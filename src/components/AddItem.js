import { css, html, LitElement } from 'lit';

export class AddItem extends LitElement {
  static get properties() {
    return {
      open: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.open = false;
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
  }

  render() {
    return html`
      <dialog>
        <form action="submit" @submit="${this.saveItem}">
          <label for="name">name</label>
          <input type="text" name="name">

          <label for="url">url</label>
          <input type="text" name="url">

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
