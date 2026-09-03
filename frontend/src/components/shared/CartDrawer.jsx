import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { closeDrawer, setPurchaseQty, removePurchase, removeLending, setLendingDays } from '../../library/slices/cartSlice.js';
import { formatKES } from '../../library/json/booksData.js';
import { SafeImage } from './SafeImage.jsx';
import styles from '../../styles/components/page/CartPage.module.css';

export function CartDrawer() {
  const dispatch = useAppDispatch();
  const drawer = useAppSelector((s) => s.cart.drawer);
  const purchase = useAppSelector((s) => s.cart.purchase) || [];
  const lending = useAppSelector((s) => s.cart.lending) || [];
  const navigate = useNavigate();
  if (!drawer) return null;
  const isP = drawer === 'purchase';
  const items = isP ? purchase : lending;
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
              <SafeImage src={i.cover} alt="" className="thumb-cover" />
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
  );
}
