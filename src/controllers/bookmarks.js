export class BookmarksController {
  constructor(host) {
    this.host = host;
    this.host.addController(this);

    this.rootId = '';
    this.list = [];
  }

  getRootId() {
    if (!this.rootId) {
      this.rootId = localStorage.getItem('quickdialRoot');
    }

    return this.rootId;
  }

  async save({ id, url, title, parentId }) {
    if (id) {
      const [ bm ] = await browser.bookmarks.get(id);
      if (bm.parentId != parentId) {
        browser.bookmarks.move(
          id,
          {
            parentId
          }
        );
      }
      if (bm.title != title || bm.url != url) {
        browser.bookmarks.update(
          id,
          {
            title,
            url,
          },
        );
      }
    } else {
      browser.bookmarks.create({
        title: title ? title : url,
        parentId: parentId ?? this.getRootId(),
        url
      });
    }
  }

  async delete(id) {
    const links = await browser.bookmarks.getChildren(id);

    if (links.length > 0) {
      const parentId = this.getRootId();
      // move links to rootId
      await Promise.all(links.map(async l => browser.bookmarks.move(l.id, { parentId })));
    }

    await browser.bookmarks.remove(id);
  }

  async getBookmarks() {
    try {
      let bookmarks = await browser.bookmarks.getChildren(this.host.category.id);
      bookmarks = bookmarks.filter(bm => bm.type == 'bookmark');

      this.list = bookmarks;
      this.host.requestUpdate();
    } catch (err) {
      console.error(err);
    }
  }

  async getFolders() {
    try {
      const bookmarkRootId = this.getRootId();

      let bookmarks = await browser.bookmarks.getChildren(bookmarkRootId);
      let rootFolder = await browser.bookmarks.get(bookmarkRootId);

      rootFolder[0].title = 'uncategorised';

      return [ ...rootFolder, ...bookmarks.filter(bm => bm.type == 'folder') ];
    } catch (err) {
      console.error(err);
    }
  }

  hostConnected() {
    if (this.host.tagName == 'CATEGORY-LIST') {
      browser.bookmarks.onCreated.addListener((_, bookmark) => {
        if (bookmark.parentId == this.host?.category.id) {
          this.list = this.getBookmarks(bookmark.parentId);
        }
      });

      browser.bookmarks.onRemoved.addListener((_, bookmark) => {
        if (bookmark.parentId == this.host?.category.id) {
          this.list = this.getBookmarks(bookmark.parentId);
        }
      });

      browser.bookmarks.onChanged.addListener(async (id) => {
        const [ bm ] = await browser.bookmarks.get(id);

        if (bm.parentId == this.host?.category.id) {
          this.list = this.getBookmarks(bm.parentId);
        }
      });

      browser.bookmarks.onMoved.addListener((_, bookmark) => {
        if (bookmark.oldParentId == this.host.category.id) {
          this.list = this.getBookmarks(bookmark.oldParentId);
        }
        if (bookmark.parentId == this.host.category.id) {
          this.list = this.getBookmarks(bookmark.parentId);
        }
      });
    }

    if (this.host.tagName == 'QUICK-DIAL') {
      browser.bookmarks.onCreated.addListener(async () => {
        this.host.categories = await this.getFolders();
      });

      browser.bookmarks.onRemoved.addListener(async () => {
        this.host.categories = await this.getFolders();
      });

      browser.bookmarks.onMoved.addListener(async () => {
        this.host.categories = await this.getFolders();
      });
    }
  }

  hostDisconnected() {
    console.log('bookmarks controller disconnected');
  }
}
