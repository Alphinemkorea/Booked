/**
 * Public books API — swap baseURL when backend is ready.
 * Currently falls through to local seed via Redux; keep signatures stable.
 */
const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  if (!BASE) {
    // Offline / no API yet
    return { ok: false, offline: true, data: null };
  }
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

export const booksApi = {
  list: (params) => request(`/api/books?${new URLSearchParams(params || {})}`),
  get: (id) => request(`/api/books/${id}`),
  search: (q) => request(`/api/books/search?q=${encodeURIComponent(q)}`),
};
