/**
 * Frontend M-Pesa client
 * Calls Boooked backend (/api/mpesa/*) — never talks to Daraja directly.
 */
import { toMpesaMsisdn, validateMpesaPhone } from '../../../library/helpers/validation.js';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function api(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok && data.ok === undefined) {
    data.ok = false;
    data.error = data.error || data.message || `Request failed (${res.status})`;
  }
  return data;
}

/**
 * Initiate STK Push via backend → Daraja
 */
export async function initiateStkPush({ phone, amount, accountRef = 'BOOOKED', description }) {
  if (!validateMpesaPhone(phone)) {
    return { ok: false, error: 'Enter a valid Kenyan mobile number (e.g. 07XX XXX XXX).' };
  }
  if (!amount || amount < 1) {
    return { ok: false, error: 'Invalid amount.' };
  }

  const msisdn = toMpesaMsisdn(phone);

  try {
    const data = await api('/api/mpesa/stk', {
      method: 'POST',
      body: JSON.stringify({
        phone: msisdn,
        amount: Math.round(Number(amount)),
        accountRef,
        description: description || 'Boooked payment',
      }),
    });

    if (!data.ok) {
      return { ok: false, error: data.error || 'Could not initiate M-Pesa payment.' };
    }

    return {
      ok: true,
      checkoutRequestId: data.checkoutRequestId,
      merchantRequestId: data.merchantRequestId,
      msisdn: data.msisdn || msisdn,
      amount: data.amount || amount,
      accountRef,
      demo: Boolean(data.demo),
      message: data.message || `STK push sent to ${msisdn}. Enter your M-Pesa PIN.`,
    };
  } catch (err) {
    console.error('[initiateStkPush]', err);
    return {
      ok: false,
      error: 'Payment service unavailable. Is the backend running? (npm run server)',
    };
  }
}

/**
 * Poll payment status (backend checks callback store + optional Daraja query)
 */
export async function pollPaymentStatus(checkoutRequestId, { maxAttempts = 12, intervalMs = 2500 } = {}) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const data = await api(`/api/mpesa/status/${encodeURIComponent(checkoutRequestId)}`);

      if (data.status === 'completed') {
        return {
          ok: true,
          status: 'completed',
          receipt: data.receipt,
          checkoutRequestId,
          amount: data.amount,
          phone: data.phone,
        };
      }
      if (data.status === 'failed') {
        return {
          ok: false,
          status: 'failed',
          error: data.resultDesc || 'Payment was not completed.',
          checkoutRequestId,
        };
      }
    } catch (err) {
      console.warn('[pollPaymentStatus]', err);
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  return {
    ok: false,
    status: 'timeout',
    error: 'Payment timed out. If you paid, contact support with your M-Pesa receipt.',
    checkoutRequestId,
  };
}
