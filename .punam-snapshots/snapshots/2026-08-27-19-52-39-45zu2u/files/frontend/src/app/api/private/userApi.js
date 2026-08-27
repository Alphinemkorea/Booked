import { api } from '../../../library/handlers/apiClient.js';
import { HAS_API } from '../../../library/config.js';

export const userApi = {
  async getProfile() {
    if (!HAS_API) return { ok: false, offline: true };
    try {
      const data = await api.get('/api/users/me');
      return { ok: true, data: data?.user || data?.data || data };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  },

  async updateProfile(body) {
    if (!HAS_API) return { ok: false, offline: true };
    try {
      const data = await api.patch('/api/users/me', body);
      return { ok: true, data: data?.user || data?.data || data };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  },

  async uploadAvatar(file) {
    if (!HAS_API) return { ok: false, offline: true };
    const form = new FormData();
    form.append('avatar', file);
    try {
      const data = await api.post('/api/users/me/avatar', form);
      return { ok: true, avatarUrl: data?.avatarUrl || data?.url || data?.avatar || data?.data?.avatarUrl };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  },
};
