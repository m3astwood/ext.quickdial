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

