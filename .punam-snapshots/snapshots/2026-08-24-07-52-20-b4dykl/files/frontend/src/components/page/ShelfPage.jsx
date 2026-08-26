import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { setPurchaseStatus, setLoanStatus } from '../../library/slices/ordersSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { initiateStkPush, pollPaymentStatus } from '../../app/api/public/mpesaApi.js';
import { formatKES } from '../../library/json/booksData.js';
import { validateMpesaPhone } from '../../library/helpers/validation.js';

function Status({ status }) {
  const map = { pending: 'chip-warning', approved: 'chip-info', paid: 'chip-success', rejected: 'chip-danger', active: 'chip-info', return_requested: 'chip-warning', returned: 'chip-success' };
  return <span className={`chip ${map[status] || ''}`}>{String(status).replace('_', ' ')}</span>;
}

export function ShelfPage() {
  const user = useAppSelector((s) => s.auth.user);
  const purchases = useAppSelector((s) => s.orders.purchases);
  const loans = useAppSelector((s) => s.orders.loans);
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'purchases';
  const [payId, setPayId] = useState(null);
  const [phone, setPhone] = useState('');
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');
  const myOrders = useMemo(() => purchases.filter((o) => user && o.userId === user.id), [purchases, user]);
  const myLoans = useMemo(() => loans.filter((l) => user && l.userId === user.id), [loans, user]);
  if (!user) return <div className="container empty-state"><h1 className="serif">My Shelf</h1><Link to="/login" className="btn btn-primary">Sign in</Link></div>;

  const pay = async () => {
    setPayError('');
    if (!validateMpesaPhone(phone)) { setPayError('Enter a valid Kenyan number (07XX XXX XXX).'); return; }
    const order = myOrders.find((o) => o.id === payId);
    if (!order) return;
    setPaying(true);
    const stk = await initiateStkPush({ phone, amount: order.total, accountRef: order.id });
    if (!stk.ok) { setPayError(stk.error); setPaying(false); return; }
    dispatch(pushToast({ message: stk.message, tone: 'info' }));
    const status = await pollPaymentStatus(stk.checkoutRequestId);
    setPaying(false);
    if (status.ok) {
      dispatch(setPurchaseStatus({ id: order.id, status: 'paid', patch: { paidAt: new Date().toISOString(), receipt: status.receipt } }));
      dispatch(pushToast({ message: `Payment successful · Receipt ${status.receipt}` }));
      setPayId(null); setPhone('');
    }
  };

  return (
    <div className="container" style={{ padding: '36px 0 56px', minHeight: '50vh' }}>
      <h1 className="serif" style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: 22 }}>My Shelf</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 36, borderBottom: '1px solid var(--line)' }}>
        {['purchases', 'borrowing', 'history'].map((t) => (
          <button key={t} type="button" onClick={() => setParams({ tab: t })} style={{ border: 'none', background: 'none', padding: '14px 20px', fontWeight: 700, cursor: 'pointer', color: tab === t ? 'var(--primary)' : 'var(--muted)', borderBottom: tab === t ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: -1 }}>{t[0].toUpperCase() + t.slice(1)}</button>
        ))}
      </div>
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tab === 'purchases' && (myOrders.filter((o) => o.status !== 'paid' && o.status !== 'rejected').length === 0 ? (
          <div className="empty-state card"><p>No purchase orders yet.</p><Link to="/shop" className="btn btn-outline">Browse Shop</Link></div>
        ) : myOrders.filter((o) => o.status !== 'paid' && o.status !== 'rejected').map((o) => (
          <article key={o.id} className="card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10, alignItems: 'center' }}>
              <span className="chip">#{o.id}</span><Status status={o.status} /><strong className="price">{formatKES(o.total)}</strong>
            </div>
            <ul style={{ color: 'var(--muted)' }}>{o.items.map((i, idx) => <li key={idx}>{i.title} × {i.qty}</li>)}</ul>
            {o.status === 'pending' && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Awaiting admin approval before payment.</p>}
            {o.status === 'approved' && <button type="button" className="btn btn-primary btn-sm" onClick={() => setPayId(o.id)}>Pay with M-Pesa</button>}
          </article>
        )))}
        {tab === 'borrowing' && (myLoans.filter((l) => ['pending', 'active', 'return_requested'].includes(l.status)).length === 0 ? (
          <div className="empty-state card"><p>No active loans.</p><Link to="/library" className="btn btn-outline">Browse Library</Link></div>
        ) : myLoans.filter((l) => ['pending', 'active', 'return_requested'].includes(l.status)).map((l) => (
          <article key={l.id} className="card" style={{ padding: 18, display: 'flex', gap: 14 }}>
            {l.cover && <img src={l.cover} alt="" style={{ width: 56, height: 80, objectFit: 'cover', borderRadius: 6 }} />}
            <div>
              <strong>{l.title}</strong>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>{l.author}</p>
              <Status status={l.status} />
              {l.dueAt && <span className="chip chip-warning" style={{ marginLeft: 8 }}>Due {new Date(l.dueAt).toLocaleDateString()}</span>}
              {l.status === 'active' && <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: 10, display: 'block' }} onClick={() => { dispatch(setLoanStatus({ id: l.id, status: 'return_requested' })); dispatch(pushToast({ message: 'Return request submitted' })); }}>Request return</button>}
              {l.status === 'pending' && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Waiting for admin approval.</p>}
            </div>
          </article>
        )))}
        {tab === 'history' && (
          <>
            {myOrders.filter((o) => o.status === 'paid' || o.status === 'rejected').map((o) => (
              <article key={o.id} className="card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}><span>Purchase · {o.items[0]?.title}</span><Status status={o.status} /><strong className="price">{formatKES(o.total)}</strong></div>
                {o.receipt && <p style={{ color: 'var(--muted)', fontSize: 14 }}>M-Pesa receipt: {o.receipt}</p>}
              </article>
            ))}
            {myLoans.filter((l) => l.status === 'returned' || l.status === 'rejected').map((l) => (
              <article key={l.id} className="card" style={{ padding: 18 }}><span>Loan · {l.title}</span> <Status status={l.status} /></article>
            ))}
            {myOrders.filter((o) => o.status === 'paid' || o.status === 'rejected').length + myLoans.filter((l) => l.status === 'returned' || l.status === 'rejected').length === 0 && <div className="empty-state card"><p>No history yet.</p></div>}
          </>
        )}
      </div>
      {payId && (
        <div onClick={() => !paying && setPayId(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(28,25,23,.5)', display: 'grid', placeItems: 'center', zIndex: 300, padding: 16 }}>
          <div className="card" onClick={(e) => e.stopPropagation()} style={{ width: 'min(420px,100%)', padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', margin: '0 0 8px' }}>Pay with M-Pesa</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>We&apos;ll send an STK push to your phone.</p>
            <label className="label">M-Pesa number</label>
            <input className="input" placeholder="07XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={paying} />
            {payError && <p className="field-error">{payError}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button type="button" className="btn btn-ghost" disabled={paying} onClick={() => setPayId(null)}>Cancel</button>
              <button type="button" className="btn btn-primary" disabled={paying} onClick={pay}>{paying ? 'Waiting for PIN…' : 'Send STK push'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
