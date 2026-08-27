import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { closeDrawer, setPurchaseQty, removePurchase, removeLending, setLendingDays } from '../../library/slices/cartSlice.js';
import { formatKES } from '../../library/json/booksData.js';
<<<<<<< HEAD
=======
import styles from '../../styles/components/page/CartPage.module.css';
>>>>>>> fd34775763874bd90ed505782f080973551b04de

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const drawer = useAppSelector((s) => s.cart.drawer);
<<<<<<< HEAD
  const purchase = useAppSelector((s) => s.cart.purchase);
  const lending = useAppSelector((s) => s.cart.lending);
=======
  const purchase = useAppSelector((s) => s.cart.purchase) || [];
  const lending = useAppSelector((s) => s.cart.lending) || [];
>>>>>>> fd34775763874bd90ed505782f080973551b04de
  const navigate = useNavigate();
  if (!drawer) return null;
  const isP = drawer === 'purchase';
  const items = isP ? purchase : lending;
<<<<<<< HEAD
  const total = isP ? items.reduce((s, i) => s + i.price * i.qty, 0) : items.reduce((s, i) => s + (i.deposit || 0), 0);
  return (
    <div onClick={() => dispatch(closeDrawer())} style={{ position: 'fixed', inset: 0, background: 'rgba(28,25,23,.45)', zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
      <aside onClick={(e) => e.stopPropagation()} style={{ width: 'min(400px,100%)', height: '100%', background: 'var(--card)', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-md)' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottom: '1px solid var(--line)' }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', fontWeight: 800 }}>{isP ? `Buy bag · ${items.length} item${items.length===1?'':'s'}` : `Borrow bag · ${items.length} book${items.length===1?'':'s'}`}</h2>
          <button type="button" onClick={() => dispatch(closeDrawer())} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={20} /></button>
        </header>
        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          {items.length === 0 && <p style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>Your cart is empty.</p>}
          {items.map((i) => (
            <div key={i.bookId} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
              <img src={i.cover} alt="" style={{ width: 52, height: 74, objectFit: 'cover', borderRadius: 6 }} />
              <div style={{ flex: 1 }}>
                <strong>{i.title}</strong>
                <div style={{ color: 'var(--muted)', fontSize: 14 }}>{i.author}</div>
                {isP ? (
                  <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
                    <button type="button" onClick={() => dispatch(setPurchaseQty({ bookId: i.bookId, qty: i.qty - 1 }))}>−</button>
                    <span>{i.qty}</span>
                    <button type="button" onClick={() => dispatch(setPurchaseQty({ bookId: i.bookId, qty: i.qty + 1 }))}>+</button>
                    <button type="button" style={{ color: 'var(--danger)', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }} onClick={() => dispatch(removePurchase(i.bookId))}>Remove</button>
                  </div>
                ) : (
                  <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                    <select value={i.duration} onChange={(e) => dispatch(setLendingDays({ bookId: i.bookId, duration: Number(e.target.value) }))}>
                      {[7, 14, 21, 28].map((d) => <option key={d} value={d}>{d} days</option>)}
                    </select>
                    <button type="button" style={{ color: 'var(--danger)', border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => dispatch(removeLending(i.bookId))}>Remove</button>
                  </div>
                )}
              </div>
              <span className="price">{formatKES(isP ? i.price * i.qty : i.deposit)}</span>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <footer style={{ padding: '16px 20px 24px', borderTop: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '1.05rem' }}>
              <span>{isP ? 'Subtotal' : 'Total deposit'}</span>
              <strong className="price">{formatKES(total)}</strong>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>{isP ? 'Admin reviews orders before M-Pesa payment.' : 'Requires admin approval.'}</p>
            <button type="button" className="btn btn-primary btn-block" onClick={() => { dispatch(closeDrawer()); navigate(isP ? '/checkout/purchase' : '/checkout/lending'); }}>
              {isP ? 'Review order →' : 'Request borrow →'}
            </button>
          </footer>
        )}
      </aside>
    </div>
=======
  const total = isP
    ? items.reduce((s, i) => s + i.price * (i.qty || 1), 0)
    : items.reduce((s, i) => s + (i.deposit || 0), 0);

  return (
    <>
      <div className="drawer-backdrop" onClick={() => dispatch(closeDrawer())} aria-hidden />
      <aside className="drawer-side" role="dialog" aria-label={isP ? 'Buy bag' : 'Borrow bag'}>
        <header className={styles.drawerHead}>
          <h2 className="u-fw-800 u-fs-15">
            {isP ? `Buy bag · ${items.length}` : `Borrow bag · ${items.length}`}
          </h2>
          <button type="button" className="icon-btn" onClick={() => dispatch(closeDrawer())} aria-label="Close">
            <X size={20} />
          </button>
        </header>
        <div className={styles.drawerBody}>
          {items.length === 0 && <p className="u-text-center u-muted">Your cart is empty.</p>}
          {items.map((i) => (
            <div key={i.bookId} className={styles.line}>
              <img src={i.cover} alt="" className="thumb-cover" />
              <div className={styles.lineInfo}>
                <div className={styles.lineTitle}>{i.title}</div>
                <div className={styles.lineMeta}>
                  {isP ? formatKES(i.price) : `Deposit ${formatKES(i.deposit)}`}
                </div>
                {isP && (
                  <input
                    type="number"
                    min={1}
                    className="input"
                    value={i.qty || 1}
                    onChange={(e) => dispatch(setPurchaseQty({ bookId: i.bookId, qty: Number(e.target.value) || 1 }))}
                    aria-label="Quantity"
                  />
                )}
                {!isP && (
                  <input
                    type="number"
                    min={7}
                    max={30}
                    className="input"
                    value={i.duration || 14}
                    onChange={(e) => dispatch(setLendingDays({ bookId: i.bookId, duration: Number(e.target.value) || 14 }))}
                    aria-label="Loan days"
                  />
                )}
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => dispatch(isP ? removePurchase(i.bookId) : removeLending(i.bookId))}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <footer className={styles.drawerFoot}>
          <div className={styles.totals}>
            <span>{isP ? 'Total' : 'Deposits'}</span>
            <strong className="price accent">{formatKES(total)}</strong>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={!items.length}
            onClick={() => {
              dispatch(closeDrawer());
              navigate(isP ? '/checkout/purchase' : '/checkout/lending');
            }}
          >
            {isP ? 'Checkout' : 'Request loans'}
          </button>
        </footer>
      </aside>
    </>
>>>>>>> fd34775763874bd90ed505782f080973551b04de
  );
}
