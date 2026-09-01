/**
 * Authenticated user API.
 * uploadAvatar: POST multipart → { avatarUrl }
 * Wire VITE_API_URL + Authorization header when backend is live.
 */
const BASE = import.meta.env.VITE_API_URL || '';

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const userApi = {
  async getProfile(token) {
    if (!BASE) return { ok: false, offline: true };
    const res = await fetch(`${BASE}/api/users/me`, { headers: authHeaders(token) });
    return { ok: res.ok, data: await res.json().catch(() => null) };
  },

  /** Replace local FileReader flow with this when API exists */
  async uploadAvatar(file, token) {
    if (!BASE) {
      // Caller should keep using local data URL fallback
      return { ok: false, offline: true, message: 'Avatar API not configured' };
    }
    const body = new FormData();
    body.append('avatar', file);
    const res = await fetch(`${BASE}/api/users/me/avatar`, {
      method: 'POST',
      headers: authHeaders(token),
      body,
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, data };
  },

  async updateProfile(patch, token) {
    if (!BASE) return { ok: false, offline: true };
    const res = await fetch(`${BASE}/api/users/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
      body: JSON.stringify(patch),
    });
    return { ok: res.ok, data: await res.json().catch(() => null) };
  },
};
