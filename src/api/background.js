browser.runtime.onInstalled.addListener(() => {
  console.log('onInstalled event');
    window.setTimeout(() => {
      quickdialVerify();
    }, 500);
});

browser.runtime.onStartup.addListener(quickdialVerify);

async function quickdialVerify() {
  const dirId = localStorage.getItem('quickdialRoot');
  if (dirId && dirId !== 'undefined') {
    console.log('found id :',dirId);

    try {
      const [ bookmark ] = await browser.bookmarks.get(dirId);
      console.log(`found bookmark with id ${dirId} :`, bookmark);
    } catch (error) {
      quickdialInit();
    }
    return;
  }

  const [ bookmark ] = await browser.bookmarks.search('quickdial-extension');
  if (bookmark?.title === 'quickdial-extension' && bookmark?.id) {
    console.log('found bookmark :',bookmark);
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
