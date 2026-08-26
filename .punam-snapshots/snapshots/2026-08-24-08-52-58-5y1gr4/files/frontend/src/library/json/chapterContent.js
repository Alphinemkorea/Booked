/** Sample digital content — replace with backend chapter API later */
const FALLBACK = (title, author) => [
  {
    title: 'Chapter 1',
    body: `${title}\n\nby ${author}\n\n—\n\nThe morning light spilled across the desk as the story began. In this digital edition, every page lives in your browser — no shipping, no shelf space, only the words.\n\nYou can change the type size, switch to a calm reading theme, and pick up exactly where you left off. When a loan ends, access locks automatically. When you own the book, it stays with you.\n\nScroll slowly. The best books ask for patience.`,
  },
  {
    title: 'Chapter 2',
    body: `The second chapter opens a wider room. Characters step forward; motives tangle; the city outside the window does not care.\n\nOnline libraries work like this: borrow for a set number of days, read instantly on any device, and when the clock runs out the file closes itself — fair for the next reader waiting in line.\n\nIf you purchased this title, there is no clock. Only the next page.`,
  },
  {
    title: 'Chapter 3',
    body: `By the third chapter the pattern is clear. Stories compound. Detail becomes destiny.\n\nThis sample text stands in for the full manuscript your backend will stream page by page. Wire VITE_API_URL and a /api/books/:id/content endpoint when the catalogue is live.\n\nUntil then, enjoy the quiet of a well-set page.`,
  },
];

/** Optional richer samples for known titles */
const SPECIAL = {
  b5: [
    {
      title: 'Prologue',
      body: `The Alchemist\n\nby Paulo Coelho\n\n—\n\nThe boy's name was Santiago. Dusk was falling as the boy arrived with his herd at an abandoned church. The roof had fallen in long ago, and an enormous sycamore had grown on the spot where the sacristy had once stood.\n\nHe decided to spend the night there. He saw to it that all the sheep entered through the ruined door, and then laid some planks across it to prevent the flock from wandering away during the night. There were no wolves in the region, but once an animal had strayed during the night, and the boy had had to spend the entire next day searching for it.\n\nHe swept the floor with his jacket and lay down, using the book he had just finished reading as a pillow.`,
    },
    {
      title: 'The Dream',
      body: `He awoke as the sun went down, and looked out over the countryside. He thought of the merchant's daughter — and of the dream that had returned for a second night.\n\nIn the dream, a child led him to the Egyptian pyramids. At the pyramids, the child said, the boy would find a hidden treasure.\n\nSantiago had never been to Egypt. He had only ever tended sheep across Andalusia. Yet the dream insisted, and dreams, his grandfather used to say, are the language of God.`,
    },
    {
      title: 'The Decision',
      body: `He would need a ticket, courage, and someone who understood omens. The merchant's shop could wait. The sheep would be sold. The road to Tarifa — and beyond — would open.\n\nEvery journey begins with a single yes.`,
    },
  ],
};

export function getChapters(book) {
  if (!book) return FALLBACK('Untitled', 'Unknown');
  if (SPECIAL[book.id]) return SPECIAL[book.id];
  return FALLBACK(book.title, book.author);
}
