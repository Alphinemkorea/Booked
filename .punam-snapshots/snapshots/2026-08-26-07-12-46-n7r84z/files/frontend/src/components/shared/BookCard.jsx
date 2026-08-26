import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { addPurchase, addLending, openDrawer } from '../../library/slices/cartSlice.js';
import { toggleWish } from '../../library/slices/wishlistSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { formatKES } from '../../library/json/booksData.js';
import { setIntent } from '../../library/helpers/intent.js';
import { SafeImage } from './SafeImage.jsx';
import styles from '../../styles/components/shared/BookCard.module.css';

export function BookCard({ book, variant = 'shop', style }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const wish = useAppSelector((s) => s.wishlist.ids);
  const navigate = useNavigate();
  if (!book) return null;

  const isLibrary = variant === 'library';
  const wished = wish.includes(book.id);

  const requireAuth = (intent, next) => {
    if (!user) {
      setIntent(intent);
      dispatch(pushToast({ message: 'Sign in to continue — we will take you right back', tone: 'info' }));
      navigate('/login', { state: { from: intent.from || `/book/${book.id}` } });
      return;
    }
    next();
  };

  const onOpen = (e) => {
    if (!user) {
      e.preventDefault();
      setIntent({ type: 'view', bookId: book.id, from: `/book/${book.id}` });
      dispatch(pushToast({ message: 'Create an account or sign in to view details', tone: 'info' }));
      navigate('/login', { state: { from: `/book/${book.id}` } });
    }
  };

  return (
    <article className={styles.card} style={style}>
      <Link to={`/book/${book.id}`} className={styles.coverWrap} onClick={onOpen}>
        <SafeImage src={book.cover} alt={book.title} className={styles.cover} />
        <div className={styles.vignette} />
        <button
          type="button"
          className={`${styles.heart} ${wished ? styles.on : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            requireAuth({ type: 'wish', bookId: book.id, from: `/book/${book.id}` }, () => {
              dispatch(toggleWish(book.id));
              dispatch(pushToast({ message: wished ? 'Removed from wishlist' : 'Saved to wishlist' }));
            });
          }}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} />
        </button>
        {isLibrary && (
          <span className={styles.avail}>{book.forLoan ? 'Available' : 'Waitlist'}</span>
        )}
      </Link>
      <span className={styles.genre}>{book.genre}</span>
      <Link to={`/book/${book.id}`} onClick={onOpen}>
        <h3 className={`serif ${styles.title}`}>{book.title}</h3>
      </Link>
      <p className={styles.author}>{book.author}</p>
      <div className={styles.rating}>
        {'★'.repeat(Math.min(5, Math.round(book.rating || 0)))}
        <span>{book.rating}</span>
      </div>
      <div className={styles.row}>
        {isLibrary ? (
          <>
            <span className={styles.price}>Dep. {formatKES(book.deposit || 0)}</span>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!book.forLoan}
              onClick={(e) => {
                e.preventDefault();
                requireAuth({ type: 'lend', bookId: book.id, from: `/book/${book.id}` }, () => {
                  dispatch(addLending({
                    bookId: book.id, title: book.title, author: book.author,
                    cover: book.cover, deposit: book.deposit || 0, duration: book.loanDays || 14,
                  }));
                  dispatch(pushToast({ message: `“${book.title}” added to lending cart` }));
                  dispatch(openDrawer('lending'));
                });
              }}
            >
              Borrow
            </button>
          </>
        ) : (
          <>
            <span className={styles.price}>{formatKES(book.price)}</span>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={!book.forSale || book.stock < 1}
              onClick={(e) => {
                e.preventDefault();
                requireAuth({ type: 'buy', bookId: book.id, from: `/book/${book.id}` }, () => {
                  dispatch(addPurchase({
                    bookId: book.id, title: book.title, author: book.author,
                    price: book.price, cover: book.cover, qty: 1,
                  }));
                  dispatch(pushToast({ message: `“${book.title}” added to purchase cart` }));
                  dispatch(openDrawer('purchase'));
                });
              }}
            >
              Buy
            </button>
          </>
        )}
      </div>
    </article>
  );
}
