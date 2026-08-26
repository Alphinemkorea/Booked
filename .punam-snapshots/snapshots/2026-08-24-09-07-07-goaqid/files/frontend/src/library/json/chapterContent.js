export function getChapters(book) {
  const title = book?.title || 'Untitled';
  const author = book?.author || 'Unknown';
  return [
    {
      title: 'Chapter 1',
      body: `${title}\n\nby ${author}\n\n—\n\nThis is your digital edition. Nothing was shipped. The pages live in your browser the moment your purchase is paid or your loan deposit clears.\n\nChange theme and type size in the toolbar. Your place is saved on this device.`,
    },
    {
      title: 'Chapter 2',
      body: `Borrowed titles unlock for a fixed number of days. When the clock ends, access locks automatically so the next reader can begin.\n\nOwned titles never expire. Open them whenever you like from My Shelf.`,
    },
    {
      title: 'Chapter 3',
      body: `When your backend is ready, replace this sample with streamed chapters from /api/books/:id/content.\n\nUntil then, this stand-in keeps the reading experience working end to end.`,
    },
  ];
}
