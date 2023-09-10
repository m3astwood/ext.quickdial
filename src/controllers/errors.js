export class ErrorController {
  constructor(host) {
    this.host = host;
    this.host.addController(this);

    this.errors = [];
  }

  hostConnected() {
    this.host.addEventListener('error', (evt) => {
      const { error } = evt.detail;
      error.createdAt = Date.now();

      this.errors = [ ...this.errors, error ];

      setTimeout((createdAt) => {
        const idx = this.errors.findIndex(e => e.createdAt == createdAt);
        this.errors.splice(idx, 1);
        this.host.requestUpdate();
      }, 3000, error.createdAt);

      this.host.requestUpdate();
    });
  }
}
