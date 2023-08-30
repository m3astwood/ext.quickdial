import { css, html, LitElement } from 'lit';

class QuickMenu extends LitElement {
  static get properties() {
    return {};
  }

  constructor() {
    super();
    console.log('message from quickdial menu');
  }

  async saveTab() {
    try {
      //eslint-disable-next-line no-undef
      const [ct] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!ct) throw new Error('No current tab data found');

      console.log(ct);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return html`
    <button @click="${this.saveTab}">add quickdial</button>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      button {
        border: none;
        background: none;
        color: inherit;
        cursor: pointer;
      }

      button:hover {
        text-decoration: underline;
      }
    `;
  }
}

window.customElements.define('quick-menu', QuickMenu);
