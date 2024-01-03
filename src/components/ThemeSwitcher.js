import { css, html, LitElement } from 'lit';

class ThemeSwitcher extends LitElement {
  static properties = {
    preferDark: { type: Boolean, state: true },
    currentTheme: { type: String, state: true },
    setTheme: { type: String, state: true }
  };

  constructor() {
    super();
    this.preferDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.setTheme = localStorage.getItem('theme') || this.preferDark.matches ? 'dark' : 'light';
  }

  firstUpdated() {
    this.currentTheme = localStorage.getItem('theme');

    if (this.currentTheme == 'dark') {
      document.body.classList.toggle('dark');
    } else if (this.currentTheme == 'light') {
      document.body.classList.toggle('light');
    }
  }

  themeSwitch() {
    let theme;

    if (this.preferDark.matches) {
      document.body.classList.toggle('light');
      theme = document.body.classList.contains('light')
        ? 'light'
        : 'dark';
    } else {
      document.body.classList.toggle('dark');
      theme = document.body.classList.contains('dark')
        ? 'dark'
        : 'light';
    }

    localStorage.setItem('theme', theme);
  }

  render() {
    return html`
      <input type="checkbox" id="themeSwitcher" name="theme" @click="${this.themeSwitch}" ?checked="${this.setTheme == 'dark'}" /><label for="theme">dark theme</label>
    `;
  }

  static styles = css``;
}

customElements.define('theme-switcher', ThemeSwitcher);
