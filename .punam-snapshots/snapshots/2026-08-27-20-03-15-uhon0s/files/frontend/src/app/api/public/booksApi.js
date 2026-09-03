import { api } from '../../../library/handlers/apiClient.js';
import { HAS_API } from '../../../library/config.js';
import { normalizeBook, normalizeBooks } from '../../../library/helpers/normalizeBook.js';

export const booksApi = {
  async list(params = {}) {
    if (!HAS_API) return { ok: false, offline: true, books: [] };
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v != null && v !== '')
    ).toString();
    const path = qs ? `/api/books?${qs}` : '/api/books';
    const data = await api.get(path, { auth: false });
    return { ok: true, books: normalizeBooks(data), raw: data };
  },

  async get(id) {
    if (!HAS_API) return { ok: false, offline: true, book: null };
    const data = await api.get(`/api/books/${id}`, { auth: false });
    const book = normalizeBook(data?.book || data?.data || data);
    return { ok: Boolean(book), book, raw: data };
  },

  async search(q) {
    if (!HAS_API) return { ok: false, offline: true, books: [] };
    const data = await api.get(`/api/books/search?q=${encodeURIComponent(q)}`, { auth: false });
    return { ok: true, books: normalizeBooks(data), raw: data };
  },

  async create(body) {
    const data = await api.post('/api/books', body);
    return { ok: true, book: normalizeBook(data?.book || data?.data || data), raw: data };
  },

  async update(id, body) {
    const data = await api.put(`/api/books/${id}`, body);
    return { ok: true, book: normalizeBook(data?.book || data?.data || data), raw: data };
  },

  async remove(id) {
    await api.del(`/api/books/${id}`);
    return { ok: true };
  },
};
