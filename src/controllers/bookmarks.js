export class BookmarksController {

  static get properties() {
    return {
      rootId: { type: String },
      editing: { type: Object },
    };
  }

  constructor(host) {
    this.host = host;
    this.host.addController(this);

    this.rootId = '';
    this.editing = {};
  }

  getRootId() {
    if (!this.rootId) {
      this.rootId = localStorage.getItem('quickdialRoot');
    }

    return this.rootId;
  }

  async save({ id, url, title }) {
    if (id) {
      browser.bookmarks.update(
        id,
        {
          title,
          url,
        },
      );
    } else {
      browser.bookmarks.create({
        title: title ? title : url,
        parentId: this.getRootId(),
        url
      });
    }
  }

  delete(id) {
    browser.bookmarks.remove(id)
  }

  async getBookmarks(parentId) {
    try {
      parentId = parentId ? parentId : this.getRootId();

      let bookmarks = await browser.bookmarks.getChildren(parentId);
      bookmarks = bookmarks.filter(bm => bm.type == 'bookmark');

      return bookmarks;
    } catch (err) {
      console.error(err);
    }
  }

  async getFolders() {
    try {
      const bookmarkRootId = this.getRootId();

      let bookmarks = await browser.bookmarks.getChildren(bookmarkRootId);
      let rootFolder = await browser.bookmarks.get(bookmarkRootId);

      return await [...rootFolder, ...bookmarks.filter(bm => bm.type == 'folder')];
    } catch (err) {
      console.error(err);
    }
  }


  hostConnected() {
    console.log('bookmarks controller connected', this.host);
  }

  hostDisconnected() {
    console.log('bookmarks controller disconnected');
  }
}
