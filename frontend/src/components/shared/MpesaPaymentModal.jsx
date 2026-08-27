import { useState } from 'react';
<<<<<<< HEAD
import { Smartphone, CheckCircle2, X, Loader2, Shield } from 'lucide-react';
import { initiateStkPush, pollPaymentStatus } from '../../app/api/public/mpesaApi.js';
import { validateMpesaPhone } from '../../library/helpers/validation.js';
import { formatKES } from '../../library/json/booksData.js';

/**
 * Jumia-style M-Pesa STK payment sheet.
 * steps: form → pushing → waiting_pin → success | error
 */
=======
import { X, Loader2 } from 'lucide-react';
import { initiateStkPush, pollPaymentStatus } from '../../app/api/public/mpesaApi.js';
import { validateMpesaPhone } from '../../library/helpers/validation.js';
import { formatKES } from '../../library/json/booksData.js';
import styles from '../../styles/components/shared/MpesaPaymentModal.module.css';

>>>>>>> origin/develop
export function MpesaPaymentModal({
  open,
  onClose,
  amount,
  title = 'Pay with M-Pesa',
  subtitle,
  lineItems = [],
<<<<<<< HEAD
  accountRef = 'BOOOKED',
  onSuccess,
}) {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('form'); // form | pushing | waiting_pin | success | error
=======
  accountRef = 'BOOKED',
  onSuccess,
}) {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('form');
>>>>>>> origin/develop
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState('');
  const [msisdn, setMsisdn] = useState('');

  if (!open) return null;

  const reset = () => {
    setStep('form');
    setError('');
    setReceipt('');
    setPhone('');
  };

  const close = () => {
    if (step === 'pushing' || step === 'waiting_pin') return;
    reset();
    onClose();
  };

  const pay = async () => {
    setError('');
    if (!validateMpesaPhone(phone)) {
      setError('Enter a valid Safaricom number (07XX XXX XXX or 01XX XXX XXX).');
      return;
    }
    setStep('pushing');
    const stk = await initiateStkPush({ phone, amount, accountRef });
    if (!stk.ok) {
      setError(stk.error);
      setStep('error');
      return;
    }
    setMsisdn(stk.msisdn);
    setStep('waiting_pin');
    const status = await pollPaymentStatus(stk.checkoutRequestId);
    if (status.ok && status.status === 'completed') {
      setReceipt(status.receipt);
      setStep('success');
<<<<<<< HEAD
      onSuccess?.({ receipt: status.receipt, msisdn: stk.msisdn, amount, checkoutRequestId: stk.checkoutRequestId });
    } else {
      setError('Payment was not completed. If you entered the wrong PIN, try again.');
=======
      onSuccess?.({
        receipt: status.receipt,
        msisdn: stk.msisdn,
        amount,
        checkoutRequestId: stk.checkoutRequestId,
      });
    } else {
      setError(status.error || 'Payment was not completed. If you entered the wrong PIN, try again.');
>>>>>>> origin/develop
      setStep('error');
    }
  };

  return (
<<<<<<< HEAD
    <div
      onClick={close}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,14,13,0.55)',
        zIndex: 400,
        display: 'grid',
        placeItems: 'center',
        padding: 16,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        className="card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(420px, 100%)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          animation: 'scaleIn 0.22s var(--ease)',
        }}
      >
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: '#00A651', display: 'grid', placeItems: 'center', color: '#fff' }}>
              <Smartphone size={20} />
            </div>
            <div>
              <strong style={{ display: 'block' }}>{title}</strong>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Lipa na M-Pesa · STK Push</span>
            </div>
          </div>
          {step !== 'pushing' && step !== 'waiting_pin' && (
            <button type="button" onClick={close} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted)' }} aria-label="Close">
              <X size={20} />
            </button>
          )}
        </header>

        <div style={{ padding: 20 }}>
          {subtitle && <p style={{ margin: '0 0 14px', color: 'var(--muted)', fontSize: 14 }}>{subtitle}</p>}

          {lineItems.length > 0 && (
            <ul style={{ listStyle: 'none', margin: '0 0 14px', padding: 0, border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
              {lineItems.map((li, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < lineItems.length - 1 ? '1px solid var(--line)' : 'none', fontSize: 14 }}>
                  <span style={{ color: 'var(--muted)' }}>{li.label}</span>
                  <span style={{ fontWeight: 700 }}>{formatKES(li.amount)}</span>
                </li>
              ))}
            </ul>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 14px', background: 'var(--well)', borderRadius: 12, marginBottom: 18 }}>
            <span style={{ fontWeight: 700 }}>Amount</span>
            <strong className="price" style={{ fontSize: '1.45rem' }}>{formatKES(amount)}</strong>
          </div>

          {(step === 'form' || step === 'error') && (
            <>
              <label className="label">M-Pesa phone number</label>
              <input
                className={`input ${error ? 'error' : ''}`}
                placeholder="07XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
              />
              {error && <p className="field-error">{error}</p>}
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: '12px 0 0', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <Shield size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                You will receive an STK push on your phone. Enter your M-Pesa PIN to complete. BOOOKED never sees your PIN.
              </p>
              <button type="button" className="btn btn-primary btn-block" style={{ marginTop: 18, background: '#00A651', borderColor: '#00A651', boxShadow: '0 4px 14px rgba(0,166,81,0.3)' }} onClick={pay}>
                Pay {formatKES(amount)} with M-Pesa
              </button>
              {step === 'error' && (
                <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 8 }} onClick={() => { setStep('form'); setError(''); }}>
                  Try again
                </button>
              )}
            </>
          )}

          {(step === 'pushing' || step === 'waiting_pin') && (
            <div style={{ textAlign: 'center', padding: '24px 8px' }}>
              <Loader2 size={40} color="var(--primary)" style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
              <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: 8 }}>
                {step === 'pushing' ? 'Sending STK push…' : 'Check your phone'}
              </strong>
              <p style={{ color: 'var(--muted)', margin: 0, fontSize: 14, lineHeight: 1.5 }}>
                {step === 'waiting_pin'
                  ? `A prompt was sent to ${msisdn}. Enter your M-Pesa PIN to authorize ${formatKES(amount)}.`
                  : 'Connecting to Safaricom…'}
              </p>
            </div>
          )}

          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '16px 8px 8px' }}>
              <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 12px' }} />
              <strong style={{ display: 'block', fontSize: '1.2rem', marginBottom: 6 }}>Payment successful</strong>
              <p style={{ color: 'var(--muted)', margin: '0 0 8px' }}>Receipt: <strong style={{ color: 'var(--ink)' }}>{receipt}</strong></p>
              <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 18px' }}>{formatKES(amount)} paid via M-Pesa</p>
              <button type="button" className="btn btn-primary btn-block" onClick={() => { reset(); onClose(); }}>Done</button>
            </div>
          )}
        </div>
=======
    <div className="overlay" onClick={close} role="presentation">
      <div
        className={`card ${styles.modal}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="u-flex u-justify-between u-items-center">
          <h2 className={`serif ${styles.title}`}>{title}</h2>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close" disabled={step === 'pushing' || step === 'waiting_pin'}>
            <X size={18} />
          </button>
        </div>
        {subtitle && <p className={styles.sub}>{subtitle}</p>}
        <div className={styles.amount}>{formatKES(amount)}</div>

        {lineItems.length > 0 && (
          <ul className="u-muted u-fs-14">
            {lineItems.map((li, i) => (
              <li key={i}>{li}</li>
            ))}
          </ul>
        )}

        {step === 'form' && (
          <>
            <div className={styles.steps}>
              <div className={styles.step}><span className={styles.stepNum}>1</span> Enter M-Pesa number</div>
              <div className={styles.step}><span className={styles.stepNum}>2</span> Approve STK prompt on phone</div>
              <div className={styles.step}><span className={styles.stepNum}>3</span> Digital access unlocks</div>
            </div>
            {error && <div className="chip chip-danger u-w-full">{error}</div>}
            <label className="label" htmlFor="mpesa-phone">Phone</label>
            <input
              id="mpesa-phone"
              className="input"
              placeholder="07XX XXX XXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
            />
            <div className={styles.actions}>
              <button type="button" className="btn btn-ghost" onClick={close}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={pay}>Pay {formatKES(amount)}</button>
            </div>
          </>
        )}

        {(step === 'pushing' || step === 'waiting_pin') && (
          <div className={styles.waiting}>
            <div className={styles.spinner} aria-hidden />
            <p className="u-fw-700">{step === 'pushing' ? 'Sending STK push…' : 'Enter PIN on your phone'}</p>
            {msisdn && <p className="u-muted u-fs-13">{msisdn}</p>}
            <Loader2 className="u-primary" size={20} />
          </div>
        )}

        {step === 'success' && (
          <div className={styles.success}>
            <p className="u-fw-800 u-success">Payment received</p>
            <p className={styles.receipt}>{receipt}</p>
            <button type="button" className="btn btn-primary" onClick={close}>Done</button>
          </div>
        )}

        {step === 'error' && (
          <div className={styles.success}>
            <p className="u-fw-700" style={{ color: 'var(--danger)' }}>{error || 'Payment failed'}</p>
            <div className={styles.actions}>
              <button type="button" className="btn btn-ghost" onClick={close}>Close</button>
              <button type="button" className="btn btn-primary" onClick={() => { setError(''); setStep('form'); }}>Try again</button>
            </div>
          </div>
        )}
>>>>>>> origin/develop
      </div>
    </div>
  );
}
