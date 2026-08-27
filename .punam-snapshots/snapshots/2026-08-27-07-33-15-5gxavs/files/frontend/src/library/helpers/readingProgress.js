import { load, save } from './storage.js';

const KEY = 'bk-continue';

export function setContinueReading(entry) {
  if (!entry?.bookId) return;
  const list = load(KEY, []);
  const next = [
    { ...entry, at: Date.now() },
    ...list.filter((x) => x.bookId !== entry.bookId),
  ].slice(0, 8);
  save(KEY, next);
}

export function getContinueReading(userId) {
  const list = load(KEY, []);
  if (!userId) return list;
  return list.filter((x) => !x.userId || x.userId === userId);
}

export function getProgress(userId, bookId) {
  return load(`bk-read-${userId || 'g'}-${bookId}`, null);
}
