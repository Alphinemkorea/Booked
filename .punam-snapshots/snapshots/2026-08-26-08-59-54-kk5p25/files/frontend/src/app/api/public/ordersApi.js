/** Orders & loans — ready for backend state machine */
const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  if (!BASE) return { ok: false, offline: true };
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return { ok: res.ok, data: await res.json().catch(() => null), status: res.status };
}

export const ordersApi = {
  createPurchase: (body, token) =>
    request('/api/orders', { method: 'POST', body: JSON.stringify(body), headers: { Authorization: `Bearer ${token}` } }),
  createLoanRequest: (body, token) =>
    request('/api/loans', { method: 'POST', body: JSON.stringify(body), headers: { Authorization: `Bearer ${token}` } }),
  pay: (body, token) =>
    request('/api/payments/mpesa/stk', { method: 'POST', body: JSON.stringify(body), headers: { Authorization: `Bearer ${token}` } }),
};
