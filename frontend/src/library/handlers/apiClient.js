import { API_URL } from '../config.js';
import { load } from '../helpers/storage.js';

function getToken() {
  try {
    const session = load('bk-session', null);
    return session?.token || session?.accessToken || load('bk-token', null);
  } catch {
    return null;
  }
}

/**
 * @param {string} path - starts with /api/...
 * @param {RequestInit & { auth?: boolean, raw?: boolean }} options
 */
export async function apiClient(path, options = {}) {
  const { auth = true, raw = false, headers: extraHeaders, ...rest } = options;
  const headers = {
    Accept: 'application/json',
    ...(rest.body && !(rest.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...extraHeaders,
  };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const url = path.startsWith('http') ? path : `${API_URL}${path}`;

  let res;
  try {
    res = await fetch(url, { ...rest, headers });
  } catch (err) {
    const error = new Error(err?.message || 'Network error — is the API reachable?');
    error.code = 'NETWORK';
    throw error;
  }

  if (raw) return res;

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error || data.detail)) ||
      res.statusText ||
      `Request failed (${res.status})`;
    const error = new Error(typeof message === 'string' ? message : 'Request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }

  if (res.status === 204) return null;
  return data;
}

export const api = {
  get: (path, opts) => apiClient(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) =>
    apiClient(path, {
      ...opts,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }),
  put: (path, body, opts) =>
    apiClient(path, {
      ...opts,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }),
  patch: (path, body, opts) =>
    apiClient(path, {
      ...opts,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }),
  del: (path, opts) => apiClient(path, { ...opts, method: 'DELETE' }),
};
