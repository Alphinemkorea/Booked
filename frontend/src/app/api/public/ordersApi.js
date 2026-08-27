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

  async pay(body) {
    if (!HAS_API) return { ok: false, offline: true };
    const data = await api.post('/api/payments/mpesa/stk', body);
    return { ok: true, ...data, raw: data };
  },
};
