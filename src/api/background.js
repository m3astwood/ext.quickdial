browser.runtime.onInstalled.addListener((details) => {
  // console.log(details);

  if (details.reason == 'install') {
    window.setTimeout(() => {
      const quickdialFolder = browser.bookmarks.create({
        title: 'quickdial',
      });

      quickdialFolder.then(bookmark => {
        console.log(bookmark);
        localStorage.setItem('quickdialRoot', bookmark.id);
      });
    }, 500);
  }
});

browser.runtime.onMessage.addListener((message) => {
  console.log(message.type);
  if (message.type == 'bookmark.create') {
    const { title, url } = message.bookmark;

    browser.bookmarks.create({
      title: title ? title : url,
      parentId: this.getBookmarkRoot(),
      url
    });

  } else if (message.type == 'bookmark.update') {
    const { id, title, url } = message.bookmark;
    console.log({ id, title, url });
    browser.bookmarks.update(
      id,
      {
        title,
        url,
      },
    );

  } else if (message.type == 'bookmark.del') {
    // add bookmark refresh window?
  }
});
