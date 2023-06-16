import { css, html, LitElement } from 'lit';

export class AddItem extends LitElement {
  static get properties() {
    return {
      open: { type: Boolean },
      link: { type: Object },
    };
  }

  constructor() {
    super();
    this.open = false;
    this.link = {};
  }

  attributeChangedCallback(at, _ol, ne) {
    if (at == 'open' && ne == 'true') {
      this.renderRoot.querySelector('dialog').showModal();
    } else {
      console.log(at, ne);
    }
  }

  saveItem(evt) {
    evt.preventDefault();
    const form = new FormData(evt.target);
    const detail = { name: form.get('name'), url: form.get('url') };

    if (this.link?.id) {
      detail.id = this.link.id;
    }

    if (detail.url) {
      const event = new CustomEvent('save', {
        bubbles: true,
        composed: true,
        detail,
      });

      this.link = { id: null, name: '', url: '' };

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
        <form action="submit" @submit="${this.saveItem}">
          <label for="name">name</label>
          <input type="text" name="name" value="${this.link?.name}">

          <label for="url">url</label>
          <input type="text" name="url" value="${this.link?.url}">

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
