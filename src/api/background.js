browser.runtime.onInstalled.addListener(() => {
    window.setTimeout(() => {
      quickdialVerify();
    }, 500);
});

browser.runtime.onStartup.addListener(quickdialVerify);

async function quickdialVerify() {
  const dirId = localStorage.getItem('quickdialRoot');
  if (dirId) {
    console.log('found',dirId);

    const bookmark = await browser.bookmarks.get(dirId);
    if (!bookmark) {
      console.log('no bookmark found');
      quickdialInit();
    }
    return;
  }

  const bookmark = await browser.bookmarks.search('quickdial-extension');
  if (bookmark) {
    console.log('found',bookmark);
    localStorage.setItem('quickdialRoot', bookmark.id);
    return;
  }

  quickdialInit();
}

function quickdialInit() {
  console.log('initialising quickdial');
  const quickdialFolder = browser.bookmarks.create({
    title: 'quickdial-extension',
  });

  quickdialFolder.then(bookmark => {
    localStorage.setItem('quickdialRoot', bookmark.id);
  });
}
