import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { books as seed } from '../json/booksData.js';
import { load, save, remove } from '../helpers/storage.js';
import { HAS_API, USE_SEED_FALLBACK } from '../config.js';
import { booksApi } from '../../app/api/public/booksApi.js';

/**
 * Fetch catalogue from backend. When API is configured, local JSON seed is NOT used
 * unless the request fails and VITE_USE_SEED_FALLBACK is not "0".
 */
export const fetchBooks = createAsyncThunk('books/fetchAll', async (params, { rejectWithValue }) => {
  if (!HAS_API) {
    return { books: seed, source: 'seed' };
  }
  try {
    const res = await booksApi.list(params);
    if (!res.ok) throw new Error('Failed to load books');
    // Clear stale local cache so UI never prefers old seed
    remove('bk-books');
    return { books: res.books, source: 'api' };
  } catch (e) {
    if (USE_SEED_FALLBACK) {
      console.warn('[books] API failed, using seed fallback:', e.message);
      return { books: seed, source: 'seed-fallback', error: e.message };
    }
    return rejectWithValue(e.message || 'Failed to load books');
  }
});

export const createBookRemote = createAsyncThunk('books/create', async (body, { rejectWithValue }) => {
  try {
    if (HAS_API) {
      const res = await booksApi.create(body);
      return res.book;
    }
    return { ...body, id: body.id || `b-${Date.now().toString(36)}` };
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const updateBookRemote = createAsyncThunk('books/update', async ({ id, ...body }, { rejectWithValue }) => {
  try {
    if (HAS_API) {
      const res = await booksApi.update(id, body);
      return res.book;
    }
    return { id, ...body };
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const removeBookRemote = createAsyncThunk('books/remove', async (id, { rejectWithValue }) => {
  try {
    if (HAS_API) await booksApi.remove(id);
    return id;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

function initialItems() {
  // If API is configured, start empty and load from network (avoid flashing seed)
  if (HAS_API) return [];
  const stored = load('bk-books', null);
  if (Array.isArray(stored) && stored.length > 0) return stored;
  return seed;
}

const slice = createSlice({
  name: 'books',
  initialState: {
    items: initialItems(),
    mode: load('bk-mode', 'shop'),
    status: 'idle', // idle | loading | succeeded | failed
    source: HAS_API ? 'api' : 'seed',
    error: null,
  },
  reducers: {
    setMode(s, a) {
      s.mode = a.payload;
      save('bk-mode', a.payload);
    },
    /** Local-only mutations (offline / before API responds) */
    addBook(s, a) {
      s.items.unshift(a.payload);
      if (!HAS_API) save('bk-books', s.items);
    },
    updateBook(s, a) {
      const i = s.items.findIndex((b) => b.id === a.payload.id);
      if (i >= 0) {
        s.items[i] = { ...s.items[i], ...a.payload };
        if (!HAS_API) save('bk-books', s.items);
      }
    },
    removeBook(s, a) {
      s.items = s.items.filter((b) => b.id !== a.payload);
      if (!HAS_API) save('bk-books', s.items);
    },
    setBooks(s, a) {
      s.items = a.payload;
      s.source = 'api';
      s.status = 'succeeded';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(fetchBooks.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.items = a.payload.books;
        s.source = a.payload.source;
        s.error = a.payload.error || null;
      })
      .addCase(fetchBooks.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.payload || a.error?.message || 'Failed to load books';
      })
      .addCase(createBookRemote.fulfilled, (s, a) => {
        if (a.payload) s.items.unshift(a.payload);
      })
      .addCase(updateBookRemote.fulfilled, (s, a) => {
        if (!a.payload?.id) return;
        const i = s.items.findIndex((b) => b.id === a.payload.id);
        if (i >= 0) s.items[i] = { ...s.items[i], ...a.payload };
      })
      .addCase(removeBookRemote.fulfilled, (s, a) => {
        s.items = s.items.filter((b) => b.id !== a.payload);
      });
  },
});

export const { setMode, addBook, updateBook, removeBook, setBooks } = slice.actions;
export default slice.reducer;
