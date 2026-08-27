import { api } from '../../../library/handlers/apiClient.js';
import { HAS_API } from '../../../library/config.js';
import { booksApi } from '../public/booksApi.js';
import { ordersApi } from '../public/ordersApi.js';

/**
 * Admin-facing helpers. Prefer these from admin pages so swapping backend
 * paths is one place only.
 */
export const adminApi = {
  books: {
    list: (params) => booksApi.list(params),
    create: (body) => booksApi.create(body),
    update: (id, body) => booksApi.update(id, body),
    remove: (id) => booksApi.remove(id),
  },

  async listUsers() {
    if (!HAS_API) return { ok: false, offline: true, users: [] };
    const data = await api.get('/api/admin/users');
    const users = data?.users || data?.data || (Array.isArray(data) ? data : []);
    return { ok: true, users };
  },

  async setUserRole(userId, role) {
    if (!HAS_API) return { ok: false, offline: true };
    const data = await api.patch(`/api/admin/users/${userId}`, { role });
    return { ok: true, user: data?.user || data?.data || data };
  },

  orders: {
    list: (p) => ordersApi.listPurchases(p),
    setStatus: (id, status, patch) => ordersApi.updateOrderStatus(id, status, patch),
  },

  loans: {
    list: (p) => ordersApi.listLoans(p),
    setStatus: (id, status, patch) => ordersApi.updateLoanStatus(id, status, patch),
  },
};
