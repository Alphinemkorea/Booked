export function getChapters(book) {
  const title = book?.title || 'Untitled';
  const author = book?.author || 'Unknown';
  return [
    {
      title: 'Chapter 1',
      body: `${title}\n\nby ${author}\n\n—\n\nThis is your digital edition. Nothing was shipped. Pages open in the browser the moment your purchase is paid or your loan deposit clears.\n\nUse the toolbar to change theme and type size. Progress is saved on this device.`,
    },
    {
      title: 'Chapter 2',
      body: `Borrowed titles stay unlocked for a fixed number of days. When time ends, access locks automatically so the next reader can begin.\n\nOwned titles never expire. Open them whenever you like from My Shelf.`,
    },
    {
      title: 'Chapter 3',
      body: `When your backend is ready, replace this sample with streamed chapters from your content API.\n\nUntil then, this stand-in keeps the full reading flow working end to end.`,
    },
  ];
}
