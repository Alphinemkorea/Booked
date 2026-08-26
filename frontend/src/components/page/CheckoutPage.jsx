import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { clearPurchase, clearLending } from '../../library/slices/cartSlice.js';
import { addPurchaseOrder, addLoan } from '../../library/slices/ordersSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { formatKES } from '../../library/json/booksData.js';

export function CheckoutPage() {
  const { type } = useParams();
  const isP = type === 'purchase';
  const items = useAppSelector((s) => isP ? s.cart.purchase : s.cart.lending);
  const user = useAppSelector((s) => s.auth.user);
  const [step, setStep] = useState(1);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  if (!user) return <div className="container empty-state"><Link to="/login" className="btn btn-primary">Sign in</Link></div>;
  if (!items.length && step === 1) return <div className="container empty-state"><p>Cart empty</p><Link to={isP ? '/shop' : '/library'} className="btn btn-primary">Browse</Link></div>;
  const total = isP ? items.reduce((s, i) => s + i.price * i.qty, 0) : items.reduce((s, i) => s + (i.deposit || 0), 0);
  const submit = () => {
    if (isP) {
      dispatch(addPurchaseOrder({ id: `ord-${Date.now().toString(36)}`, userId: user.id, userName: user.name, items: items.map((i) => ({ bookId: i.bookId, title: i.title, price: i.price, qty: i.qty, cover: i.cover })), total, status: 'pending', createdAt: new Date().toISOString() }));
      dispatch(clearPurchase());
      dispatch(pushToast({ message: 'Order submitted — awaiting admin approval' }));
      navigate('/shelf?tab=purchases');
    } else {
      items.forEach((i) => dispatch(addLoan({ id: `loan-${Date.now().toString(36)}-${i.bookId}`, bookId: i.bookId, title: i.title, author: i.author, cover: i.cover, userId: user.id, userName: user.name, duration: i.duration, deposit: i.deposit, status: 'pending', createdAt: Date.now() })));
      dispatch(clearLending());
      dispatch(pushToast({ message: 'Borrow request submitted — awaiting approval' }));
      navigate('/shelf?tab=borrowing');
    }
  };
  return (
    <div className="container" style={{ padding: '40px 0 64px', maxWidth: 560, marginInline: 'auto' }}>
      <h1 className="serif" style={{ textAlign: 'center', fontSize: '2.2rem' }}>{isP ? 'Checkout' : 'Request to borrow'}</h1>
      <p style={{ textAlign: 'center', color: 'var(--muted)' }}>Confirm your {isP ? 'purchase' : 'borrowing request'}.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '28px 0', fontWeight: 700, fontSize: 14 }}>
        <span style={{ padding: '8px 14px', borderRadius: 999, background: step === 1 ? 'var(--primary)' : 'var(--well)', color: step === 1 ? '#fff' : 'var(--muted)' }}>1 Review</span>
        <span style={{ width: 40, height: 2, background: 'var(--line)', alignSelf: 'center' }} />
        <span style={{ padding: '8px 14px', borderRadius: 999, background: step === 2 ? 'var(--primary)' : 'var(--well)', color: step === 2 ? '#fff' : 'var(--muted)' }}>2 Confirm</span>
      </div>
      {step === 1 && (<>
        {items.map((i) => (
          <div key={i.bookId} className="card" style={{ display: 'flex', gap: 14, padding: 14, marginBottom: 12, alignItems: 'center' }}>
            <img src={i.cover} alt="" style={{ width: 56, height: 80, objectFit: 'cover', borderRadius: 6 }} />
            <div><strong>{i.title}</strong><p style={{ margin: '2px 0', color: 'var(--muted)' }}>{i.author}</p>
              <span>{isP ? `${i.qty} × ${formatKES(i.price)}` : `Loan ${i.duration}d · Deposit ${formatKES(i.deposit)}`}</span></div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 18px', background: 'var(--well)', borderRadius: 14, marginBottom: 16, fontSize: '1.1rem' }}>
          <span>{isP ? 'Total' : 'Total deposit'}</span><strong className="price">{formatKES(total)}</strong>
        </div>
        <button type="button" className="btn btn-primary btn-block" onClick={() => setStep(2)}>Continue →</button>
      </>)}
      {step === 2 && (<>
        <div style={{ background: 'var(--warning-soft)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <strong>Requires admin approval</strong>
          <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: 14 }}>{isP ? 'Once approved, pay with M-Pesa from My Shelf.' : 'After approval, pay the deposit via M-Pesa. Your digital loan activates and you can read online until the due date.'}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 18px', background: 'var(--well)', borderRadius: 14, marginBottom: 16 }}>
          <span>{isP ? 'Total' : 'Total deposit'}</span><strong className="price">{formatKES(total)}</strong>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
          <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={submit}>{isP ? 'Submit order' : 'Submit request'}</button>
        </div>
      </>)}
    </div>
  );
}
