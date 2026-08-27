import { createSlice } from '@reduxjs/toolkit';
import { books as seed } from '../json/booksData.js';
import { load, save } from '../helpers/storage.js';

function initialItems() {
  const stored = load('bk-books', null);
  if (Array.isArray(stored) && stored.length > 0) return stored;
  return seed;
}

const slice = createSlice({
  name: 'books',
  initialState: { items: initialItems(), mode: load('bk-mode', 'shop') },
  reducers: {
    setMode(s, a) {
      s.mode = a.payload;
      save('bk-mode', a.payload);
    },
    addBook(s, a) {
      s.items.unshift(a.payload);
      save('bk-books', s.items);
    },
    updateBook(s, a) {
      const i = s.items.findIndex((b) => b.id === a.payload.id);
      if (i >= 0) {
        s.items[i] = { ...s.items[i], ...a.payload };
        save('bk-books', s.items);
      }
    },
    removeBook(s, a) {
      s.items = s.items.filter((b) => b.id !== a.payload);
      save('bk-books', s.items);
    },
  },
});

export const { setMode, addBook, updateBook, removeBook } = slice.actions;
export default slice.reducer;
