import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { clearPurchase, clearLending } from '../../library/slices/cartSlice.js';
import { addPurchaseOrder, addLoan } from '../../library/slices/ordersSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { formatKES } from '../../library/json/booksData.js';
import { MpesaPaymentModal } from '../shared/MpesaPaymentModal.jsx';
import { CreditCard, Smartphone, ShieldCheck, Lock, ChevronRight } from 'lucide-react';

const PAY_METHODS = [
  { id: 'mpesa', label: 'M-Pesa', icon: Smartphone, desc: 'STK Push · Pay with phone' },
  { id: 'card', label: 'Card', icon: CreditCard, desc: 'Visa · Mastercard · Amex' },
];

export function CheckoutPage() {
  const { type } = useParams();
  const isP = type === 'purchase';
  const items = useAppSelector((s) => (isP ? s.cart.purchase : s.cart.lending));
  const user = useAppSelector((s) => s.auth.user);
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState('mpesa');
  const [mpesaOpen, setMpesaOpen] = useState(false);
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvc: '' });
  const [cardLoading, setCardLoading] = useState(false);
  const [cardError, setCardError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container empty-state">
        <p>Sign in to complete checkout.</p>
        <Link to="/login" className="btn btn-primary">Sign in</Link>
      </div>
    );
  }
  if (!items.length && step === 1) {
    return (
      <div className="container empty-state">
        <p>Your cart is empty.</p>
        <Link to={isP ? '/shop' : '/library'} className="btn btn-primary">Browse books</Link>
      </div>
    );
  }

  const total = isP
    ? items.reduce((s, i) => s + i.price * i.qty, 0)
    : items.reduce((s, i) => s + (i.deposit || 0), 0);

  const createOrder = (paymentMeta = {}) => {
    if (isP) {
      dispatch(
        addPurchaseOrder({
          id: `ord-${Date.now().toString(36)}`,
          userId: user.id,
          userName: user.name,
          items: items.map((i) => ({
            bookId: i.bookId,
            title: i.title,
            price: i.price,
            qty: i.qty,
            cover: i.cover,
          })),
          total,
          status: paymentMeta.paid ? 'paid' : 'pending',
          paymentMethod: paymentMeta.method || payMethod,
          receipt: paymentMeta.receipt || null,
          createdAt: new Date().toISOString(),
        })
      );
      dispatch(clearPurchase());
      dispatch(pushToast({ message: paymentMeta.paid ? 'Payment successful — order confirmed' : 'Order submitted — awaiting confirmation', tone: 'success' }));
      navigate('/shelf?tab=purchases');
    } else {
      items.forEach((i) =>
        dispatch(
          addLoan({
            id: `loan-${Date.now().toString(36)}-${i.bookId}`,
            bookId: i.bookId,
            title: i.title,
            author: i.author,
            cover: i.cover,
            userId: user.id,
            userName: user.name,
            duration: i.duration,
            deposit: i.deposit,
            status: paymentMeta.paid ? 'active' : 'pending',
            paymentMethod: paymentMeta.method || payMethod,
            receipt: paymentMeta.receipt || null,
            createdAt: Date.now(),
          })
        )
      );
      dispatch(clearLending());
      dispatch(pushToast({ message: paymentMeta.paid ? 'Deposit paid — loan activated' : 'Borrow request submitted', tone: 'success' }));
      navigate('/shelf?tab=borrowing');
    }
  };

  const onMpesaSuccess = (result) => {
    setMpesaOpen(false);
    createOrder({ paid: true, method: 'mpesa', receipt: result.receipt });
  };

  const onCardPay = async (e) => {
    e.preventDefault();
    setCardError('');
    const num = card.number.replace(/\s/g, '');
    if (num.length < 15) {
      setCardError('Enter a valid card number.');
      return;
    }
    if (!card.name.trim()) {
      setCardError('Enter the name on card.');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(card.exp)) {
      setCardError('Expiry must be MM/YY.');
      return;
    }
    if (card.cvc.length < 3) {
      setCardError('Enter a valid CVC.');
      return;
    }
    setCardLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setCardLoading(false);
    // Demo: any card works except numbers starting with 4000
    if (num.startsWith('4000')) {
      setCardError('Card declined. Try another card (demo: use any other number).');
      return;
    }
    createOrder({
      paid: true,
      method: 'card',
      receipt: `CARD-${Date.now().toString(36).toUpperCase()}`,
    });
  };

  const formatCardNumber = (v) =>
    v
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim();

  return (
    <div className="container" style={{ padding: '40px 0 80px', maxWidth: 720, marginInline: 'auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 className="serif" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.3rem)', marginBottom: 8 }}>
          {isP ? 'Secure checkout' : 'Borrow request'}
        </h1>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          {isP ? 'Review items and pay securely' : 'Confirm your borrowing request and deposit'}
        </p>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 32, fontWeight: 700, fontSize: 14 }}>
        {['Review', 'Payment', 'Done'].map((label, i) => {
          const n = i + 1;
          const active = step === n;
          const done = step > n;
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  padding: '8px 16px',
                  borderRadius: 999,
                  background: active || done ? 'var(--primary)' : 'var(--well)',
                  color: active || done ? '#fff' : 'var(--muted)',
                  fontSize: '0.9rem',
                }}
              >
                {n}. {label}
              </span>
              {i < 2 && <ChevronRight size={16} style={{ color: 'var(--line)' }} />}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <>
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            {items.map((i) => (
              <div
                key={i.bookId}
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: '12px 0',
                  borderBottom: '1px solid var(--line)',
                  alignItems: 'center',
                }}
              >
                <img src={i.cover} alt="" style={{ width: 56, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: '1.05rem' }}>{i.title}</strong>
                  <p style={{ margin: '2px 0', color: 'var(--muted)' }}>{i.author}</p>
                  <span style={{ fontWeight: 600 }}>
                    {isP ? `${i.qty} × ${formatKES(i.price)}` : `Loan ${i.duration}d · Deposit ${formatKES(i.deposit)}`}
                  </span>
                </div>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: 16,
                fontSize: '1.15rem',
                fontWeight: 800,
              }}
            >
              <span>{isP ? 'Order total' : 'Total deposit'}</span>
              <span className="price">{formatKES(total)}</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              background: 'var(--well)',
              borderRadius: 12,
              marginBottom: 20,
              fontSize: '0.92rem',
              color: 'var(--muted)',
            }}
          >
            <ShieldCheck size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
            Secure checkout · Encrypted payment · Buyer protection
          </div>

          <button type="button" className="btn btn-primary btn-block" onClick={() => setStep(2)}>
            Continue to payment →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.1rem', margin: '0 0 14px' }}>Payment method</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {PAY_METHODS.map((m) => {
                const Icon = m.icon;
                const on = payMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayMethod(m.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '14px 16px',
                      borderRadius: 14,
                      border: `1.5px solid ${on ? 'var(--primary)' : 'var(--line)'}`,
                      background: on ? 'var(--primary-soft)' : 'var(--card)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'border-color 0.15s, background 0.15s',
                    }}
                  >
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: on ? 'var(--primary)' : 'var(--well)',
                        color: on ? '#fff' : 'var(--ink)',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.02rem' }}>{m.label}</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>{m.desc}</div>
                    </div>
                    <div
                      style={{
                        marginLeft: 'auto',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: `2px solid ${on ? 'var(--primary)' : 'var(--line)'}`,
                        background: on ? 'var(--primary)' : 'transparent',
                        boxShadow: on ? 'inset 0 0 0 3px var(--card)' : 'none',
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="card"
            style={{
              padding: '14px 18px',
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 800,
              fontSize: '1.1rem',
            }}
          >
            <span>Amount due</span>
            <span className="price">{formatKES(total)}</span>
          </div>

          {payMethod === 'mpesa' && (
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => setMpesaOpen(true)}
              style={{ marginBottom: 12 }}
            >
              <Smartphone size={18} /> Pay {formatKES(total)} with M-Pesa
            </button>
          )}

          {payMethod === 'card' && (
            <form onSubmit={onCardPay} className="card" style={{ padding: 20, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: 'var(--muted)', fontSize: '0.9rem' }}>
                <Lock size={16} /> Card details are encrypted (demo — no real charge)
              </div>
              {cardError && (
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: 'var(--danger-soft)',
                    color: 'var(--danger)',
                    fontWeight: 600,
                    marginBottom: 12,
                    fontSize: '0.92rem',
                  }}
                >
                  {cardError}
                </div>
              )}
              <label className="label" htmlFor="card-number">Card number</label>
              <input
                id="card-number"
                className="input"
                placeholder="4242 4242 4242 4242"
                value={card.number}
                onChange={(e) => setCard((c) => ({ ...c, number: formatCardNumber(e.target.value) }))}
                inputMode="numeric"
                autoComplete="cc-number"
                required
                style={{ marginBottom: 12 }}
              />
              <label className="label" htmlFor="card-name">Name on card</label>
              <input
                id="card-name"
                className="input"
                placeholder="AMARA WANJIKU"
                value={card.name}
                onChange={(e) => setCard((c) => ({ ...c, name: e.target.value.toUpperCase() }))}
                autoComplete="cc-name"
                required
                style={{ marginBottom: 12 }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label className="label" htmlFor="card-exp">Expiry</label>
                  <input
                    id="card-exp"
                    className="input"
                    placeholder="MM/YY"
                    value={card.exp}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                      setCard((c) => ({ ...c, exp: v }));
                    }}
                    autoComplete="cc-exp"
                    required
                  />
                </div>
                <div>
                  <label className="label" htmlFor="card-cvc">CVC</label>
                  <input
                    id="card-cvc"
                    className="input"
                    placeholder="123"
                    value={card.cvc}
                    onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={cardLoading}>
                {cardLoading ? 'Processing…' : `Pay ${formatKES(total)}`}
              </button>
            </form>
          )}

          <button type="button" className="btn btn-ghost btn-block" onClick={() => setStep(1)}>
            ← Back to review
          </button>
        </>
      )}

      <MpesaPaymentModal
        open={mpesaOpen}
        onClose={() => setMpesaOpen(false)}
        amount={total}
        title="Pay with M-Pesa"
        subtitle={isP ? 'Complete your purchase' : 'Pay loan deposit'}
        accountRef={isP ? 'BOOOKED-ORDER' : 'BOOOKED-LOAN'}
        onSuccess={onMpesaSuccess}
      />
    </div>
  );
}
