import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { addPurchase, addLending, openDrawer } from '../../library/slices/cartSlice.js';
import { toggleWish } from '../../library/slices/wishlistSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { formatKES } from '../../library/json/booksData.js';
import styles from '../../styles/components/shared/BookCard.module.css';

export function BookCard({ book, variant = 'shop', style }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const wish = useAppSelector((s) => s.wishlist.ids);
  const navigate = useNavigate();
  if (!book) return null;
  const isLibrary = variant === 'library';
  const wished = wish.includes(book.id);
  const gate = (fn) => {
    if (!user) {
      dispatch(pushToast({ message: 'Sign in to continue', tone: 'info' }));
      navigate('/login', { state: { from: `/book/${book.id}` } });
      return;
    }
    fn();
  };
  const onOpen = (e) => {
    if (!user) {
      e.preventDefault();
      dispatch(pushToast({ message: 'Sign in to view book details', tone: 'info' }));
      navigate('/login', { state: { from: `/book/${book.id}` } });
    }
  };
  return (
    <article className={styles.card} style={style}>
      <Link to={`/book/${book.id}`} className={styles.coverWrap} onClick={onOpen}>
        <img src={book.cover} alt="" className={styles.cover} loading="lazy" />
        <button type="button" className={`${styles.heart} ${wished ? styles.on : ''}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); gate(() => { dispatch(toggleWish(book.id)); dispatch(pushToast({ message: wished ? 'Removed from wishlist' : 'Saved to wishlist' })); }); }} aria-label="Wishlist">
          <Heart size={16} />
        </button>
        {isLibrary && <span className={styles.avail}>{book.forLoan ? 'Available' : 'Waitlist'}</span>}
      </Link>
      <span className={styles.genre}>{book.genre}</span>
      <Link to={`/book/${book.id}`} onClick={onOpen}><h3 className={`serif ${styles.title}`}>{book.title}</h3></Link>
      <p className={styles.author}>{book.author}</p>
      <div className={styles.rating}>{'★'.repeat(Math.round(book.rating || 0))}<span>{book.rating}</span></div>
      <div className={styles.row}>
        {isLibrary ? (
          <><span className={styles.price}>Dep. {formatKES(book.deposit || 0)}</span>
          <button type="button" className="btn btn-primary btn-sm" onClick={(e) => { e.preventDefault(); gate(() => { dispatch(addLending({ bookId: book.id, title: book.title, author: book.author, cover: book.cover, deposit: book.deposit || 0, duration: book.loanDays || 14 })); dispatch(pushToast({ message: 'Added to lending cart' })); dispatch(openDrawer('lending')); }); }}>Borrow</button></>
        ) : (
          <><span className={styles.price}>{formatKES(book.price)}</span>
          <button type="button" className="btn btn-primary btn-sm" onClick={(e) => { e.preventDefault(); gate(() => { dispatch(addPurchase({ bookId: book.id, title: book.title, author: book.author, price: book.price, cover: book.cover, qty: 1 })); dispatch(pushToast({ message: 'Added to purchase cart' })); dispatch(openDrawer('purchase')); }); }}>Buy</button></>
        )}
      </div>
    </article>
  );
}
