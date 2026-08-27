import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { removePurchase, removeLending } from '../../library/slices/cartSlice.js';
import { formatKES } from '../../library/json/booksData.js';
import { EmptyState } from '../shared/EmptyState.jsx';
import styles from '../../styles/components/page/CartPage.module.css';

export function CartPage() {
  const dispatch = useAppDispatch();
  const purchase = useAppSelector((s) => s.cart.purchase) || [];
  const lending = useAppSelector((s) => s.cart.lending) || [];
  const buyTotal = purchase.reduce((n, i) => n + i.price * (i.qty || 1), 0);
  const lendTotal = lending.reduce((n, i) => n + (i.deposit || 0), 0);

  return (
    <div className={`container page-enter ${styles.page}`}>
      <h1 className="serif">Your bags</h1>
      <p className="u-muted">Buy to own digital · Borrow for a timed loan</p>

      <section className={`card ${styles.panel}`}>
        <h2 className="serif">Buy bag</h2>
        {purchase.length === 0 ? (
          <EmptyState title="Buy bag empty" description="Add books from the shop." action={<Link to="/shop" className="btn btn-outline">Shop</Link>} />
        ) : (
          <>
            {purchase.map((i) => (
              <div key={i.bookId} className={styles.row}>
                <img src={i.cover} alt="" className="thumb-cover" />
                <div className="u-flex-1">
                  <strong>{i.title}</strong>
                  <div className="u-muted u-fs-13">× {i.qty || 1}</div>
                </div>
                <strong className="price">{formatKES(i.price * (i.qty || 1))}</strong>
                <button type="button" className={styles.remove} onClick={() => dispatch(removePurchase(i.bookId))}>Remove</button>
              </div>
            ))}
            <div className={styles.totals}>
              <span>Total</span>
              <strong className="price accent">{formatKES(buyTotal)}</strong>
            </div>
            <Link to="/checkout/purchase" className="btn btn-primary btn-block">Checkout purchase</Link>
          </>
        )}
      </section>

      <section className={`card ${styles.panel}`}>
        <h2 className="serif">Borrow bag</h2>
        {lending.length === 0 ? (
          <EmptyState title="Borrow bag empty" description="Add books from the library." action={<Link to="/library" className="btn btn-outline">Library</Link>} />
        ) : (
          <>
            {lending.map((i) => (
              <div key={i.bookId} className={styles.row}>
                <img src={i.cover} alt="" className="thumb-cover" />
                <div className="u-flex-1">
                  <strong>{i.title}</strong>
                  <div className="u-muted u-fs-13">{i.duration || 14} days · deposit</div>
                </div>
                <strong>{formatKES(i.deposit)}</strong>
                <button type="button" className={styles.remove} onClick={() => dispatch(removeLending(i.bookId))}>Remove</button>
              </div>
            ))}
            <div className={styles.totals}>
              <span>Deposits</span>
              <strong>{formatKES(lendTotal)}</strong>
            </div>
            <Link to="/checkout/lending" className="btn btn-primary btn-block">Request loans</Link>
          </>
        )}
      </section>
    </div>
  );
}
