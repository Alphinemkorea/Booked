import { toMpesaMsisdn, validateMpesaPhone } from '../../../library/helpers/validation.js';
export async function initiateStkPush({ phone, amount, accountRef = 'BOOOKED' }) {
  if (!validateMpesaPhone(phone)) return { ok: false, error: 'Enter a valid Kenyan mobile number (e.g. 07XX XXX XXX).' };
  if (!amount || amount < 1) return { ok: false, error: 'Invalid amount.' };
  const msisdn = toMpesaMsisdn(phone);
  await new Promise((r) => setTimeout(r, 1600));
  if (Math.random() < 0.08) return { ok: false, error: 'STK push timed out. Please try again.' };
  return { ok: true, checkoutRequestId: `ws_CO_${Date.now()}`, msisdn, amount, accountRef, message: `STK push sent to ${msisdn}. Enter your M-Pesa PIN.` };
}
export async function pollPaymentStatus(id) {
  await new Promise((r) => setTimeout(r, 2000));
  return { ok: true, status: 'completed', receipt: `QGH${Math.random().toString().slice(2, 10)}`, checkoutRequestId: id };
}
