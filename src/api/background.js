browser.runtime.onInstalled.addListener(() => {
    window.setTimeout(() => {
      quickdialVerify();
    }, 500);
});

browser.runtime.onStartup.addListener(quickdialVerify);

async function quickdialVerify() {
  const dirId = localStorage.getItem('quickdialRoot');
<<<<<<< HEAD

  if (dirId && dirId !== 'undefined') {
    console.log('found id :',dirId);

    try {
      const [ bookmark ] = await browser.bookmarks.get(dirId);
      console.log(`found bookmark with id ${dirId} :`, bookmark);
    } catch (error) {
=======
  if (dirId) {
    console.log('found',dirId);

    const bookmark = await browser.bookmarks.get(dirId);
    if (!bookmark) {
      console.log('no bookmark found');
>>>>>>> refs/remotes/origin/main
      quickdialInit();
    }
    return;
  }

<<<<<<< HEAD
  const [ bookmark ] = await browser.bookmarks.search('quickdial-extension');
  if (bookmark?.title === 'quickdial-extension' && bookmark?.id) {
    console.log('found bookmark :',bookmark);
=======
  const bookmark = await browser.bookmarks.search('quickdial-extension');
  if (bookmark) {
    console.log('found',bookmark);
>>>>>>> refs/remotes/origin/main
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
