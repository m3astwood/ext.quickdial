browser.runtime.onInstalled.addListener(() => {
    window.setTimeout(() => {
      quickdialVerify();
    }, 500);
});

browser.runtime.onStartup.addListener(quickdialVerify);

async function quickdialVerify() {
  const dirId = localStorage.getItem('quickdialRoot');

  if (dirId && dirId != 'undefined') {
    console.log('found id :',dirId);

    let bookmark = false;

    try {
       [ bookmark ] = await browser.bookmarks.get(dirId);
    } catch (err) {
      console.warn('no bookmark found with id', dirId);
    }

    if (bookmark || await quickdialSearch()) {
      return;
    }
  } else {
    if (!await quickdialSearch()) {
      quickdialInit();
    }
  }
}

async function quickdialSearch() {
  const [ bookmark ] = await browser.bookmarks.search('quickdial-extension');

  if (bookmark?.title === 'quickdial-extension' && bookmark?.id) {
    console.log('found quickdial folder :',bookmark);

    localStorage.setItem('quickdialRoot', bookmark.id);
    return true;
  }
  return false;
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
