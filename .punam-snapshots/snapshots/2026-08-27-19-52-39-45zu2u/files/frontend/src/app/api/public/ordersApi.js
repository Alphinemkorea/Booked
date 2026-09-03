import { api } from '../../../library/handlers/apiClient.js';
import { HAS_API } from '../../../library/config.js';

export const ordersApi = {
  async listMine() {
    if (!HAS_API) return { ok: false, offline: true, purchases: [], loans: [] };
    const data = await api.get('/api/orders/me');
    return {
      ok: true,
      purchases: data?.purchases || data?.orders || data?.data?.purchases || [],
      loans: data?.loans || data?.data?.loans || [],
      raw: data,
    };
  },

  /** Admin: all purchases */
  async listPurchases(params = {}) {
    if (!HAS_API) return { ok: false, offline: true, orders: [] };
    const qs = new URLSearchParams(params).toString();
    const data = await api.get(qs ? `/api/orders?${qs}` : '/api/orders');
    const orders = data?.orders || data?.purchases || data?.data || (Array.isArray(data) ? data : []);
    return { ok: true, orders };
  },

  /** Admin: all loans */
  async listLoans(params = {}) {
    if (!HAS_API) return { ok: false, offline: true, loans: [] };
    const qs = new URLSearchParams(params).toString();
    const data = await api.get(qs ? `/api/loans?${qs}` : '/api/loans');
    const loans = data?.loans || data?.data || (Array.isArray(data) ? data : []);
    return { ok: true, loans };
  },

  async createPurchase(body) {
    if (!HAS_API) return { ok: false, offline: true };
    const data = await api.post('/api/orders', body);
    return { ok: true, order: data?.order || data?.data || data, raw: data };
  },

  async createLoanRequest(body) {
    if (!HAS_API) return { ok: false, offline: true };
    const data = await api.post('/api/loans', body);
    return { ok: true, loan: data?.loan || data?.data || data, raw: data };
  },

  async updateOrderStatus(id, status, patch = {}) {
    if (!HAS_API) return { ok: false, offline: true };
    const data = await api.patch(`/api/orders/${id}`, { status, ...patch });
    return { ok: true, order: data?.order || data?.data || data };
  },

  async updateLoanStatus(id, status, patch = {}) {
    if (!HAS_API) return { ok: false, offline: true };
    const data = await api.patch(`/api/loans/${id}`, { status, ...patch });
    return { ok: true, loan: data?.loan || data?.data || data };
  },

  async pay(body) {
    if (!HAS_API) return { ok: false, offline: true };
    const data = await api.post('/api/payments/mpesa/stk', body);
    return { ok: true, ...data, raw: data };
  },
};
