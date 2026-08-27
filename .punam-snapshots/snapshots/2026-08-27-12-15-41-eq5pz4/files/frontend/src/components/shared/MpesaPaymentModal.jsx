import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { initiateStkPush, pollPaymentStatus } from '../../app/api/public/mpesaApi.js';
import { validateMpesaPhone } from '../../library/helpers/validation.js';
import { formatKES } from '../../library/json/booksData.js';
import styles from '../../styles/components/shared/MpesaPaymentModal.module.css';

export function MpesaPaymentModal({
  open,
  onClose,
  amount,
  title = 'Pay with M-Pesa',
  subtitle,
  lineItems = [],
  accountRef = 'BOOKED',
  onSuccess,
}) {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('form');
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
      onSuccess?.({
        receipt: status.receipt,
        msisdn: stk.msisdn,
        amount,
        checkoutRequestId: stk.checkoutRequestId,
      });
    } else {
      setError(status.error || 'Payment was not completed. If you entered the wrong PIN, try again.');
      setStep('error');
    }
  };

  return (
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
      </div>
    </div>
  );
}
