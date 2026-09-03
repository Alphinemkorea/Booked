import { api } from '../../../library/handlers/apiClient.js';
import { HAS_API } from '../../../library/config.js';
import { save, remove } from '../../../library/helpers/storage.js';

function pickUser(data) {
  const user = data?.user || data?.data?.user || data?.data || data;
  const token = data?.token || data?.accessToken || data?.data?.token || user?.token;
  if (token) save('bk-token', token);
  if (user && typeof user === 'object') {
    const { password, ...safe } = user;
    if (token) safe.token = token;
    return safe;
  }
  return null;
}

export const authApi = {
  async login(email, password) {
    if (!HAS_API) return { ok: false, offline: true };
    try {
      const data = await api.post('/api/auth/login', { email, password }, { auth: false });
      const user = pickUser(data);
      if (!user) return { ok: false, error: 'Invalid response from server' };
      return { ok: true, user };
    } catch (e) {
      return { ok: false, error: e.message || 'Login failed' };
    }
  },

  async register({ name, email, password }) {
    if (!HAS_API) return { ok: false, offline: true };
    try {
      const data = await api.post(
        '/api/auth/register',
        { name, email, password },
        { auth: false }
      );
      const user = pickUser(data);
      if (!user) return { ok: false, error: 'Invalid response from server' };
      return { ok: true, user };
    } catch (e) {
      return { ok: false, error: e.message || 'Registration failed' };
    }
  },

  async me() {
    if (!HAS_API) return { ok: false, offline: true };
    try {
      const data = await api.get('/api/auth/me');
      const user = pickUser(data);
      return { ok: Boolean(user), user };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  },

  logoutLocal() {
    remove('bk-token');
  },
};
