import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, BookOpen } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { addPurchase, addLending, openDrawer } from '../../library/slices/cartSlice.js';
import { toggleWish } from '../../library/slices/wishlistSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { formatKES } from '../../library/json/booksData.js';
import { setIntent } from '../../library/helpers/intent.js';
import { SafeImage } from './SafeImage.jsx';
import styles from '../../styles/components/shared/BookCard.module.css';

<<<<<<< HEAD
export function BookCard({ book, variant = 'shop', style }) {
=======
export function BookCard({ book, variant = 'shop', style, className }) {
>>>>>>> fd34775763874bd90ed505782f080973551b04de
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const wish = useAppSelector((s) => s.wishlist.ids);
  const navigate = useNavigate();
  if (!book) return null;

  const isLibrary = variant === 'library';
  const wished = wish.includes(book.id);
  const lowStock = book.forSale && book.stock > 0 && book.stock <= 3;

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
      dispatch(pushToast({ message: 'Sign in to view full details', tone: 'info' }));
      navigate('/login', { state: { from: `/book/${book.id}` } });
    }
  };

  return (
<<<<<<< HEAD
    <article className={styles.card} style={style}>
=======
    <article className={[styles.card, className].filter(Boolean).join(' ')} style={style}>
>>>>>>> fd34775763874bd90ed505782f080973551b04de
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
        <div className={styles.badges}>
          {isLibrary ? (
            <span className={`${styles.badge} ${styles.badgeLoan}`}>
              {book.forLoan ? 'Borrow' : 'Waitlist'}
            </span>
          ) : (
            book.forSale && <span className={`${styles.badge} ${styles.badgeSale}`}>Buy</span>
          )}
          {lowStock && <span className={`${styles.badge} ${styles.badgeStock}`}>{book.stock} left</span>}
          {!isLibrary && book.forLoan && (
            <span className={`${styles.badge} ${styles.badgeLoan}`}>Also borrow</span>
          )}
        </div>
      </Link>

      <span className={styles.genre}>{book.genre}</span>
      <Link to={`/book/${book.id}`} onClick={onOpen}>
        <h3 className={`serif ${styles.title}`}>{book.title}</h3>
      </Link>
      <p className={styles.author}>{book.author}</p>

      <div className={styles.meta}>
        <span className={styles.rating}>
          <Star size={12} fill="currentColor" /> {book.rating}
        </span>
        {book.pages && (
          <span>
            <BookOpen size={12} /> {book.pages}p
          </span>
        )}
        {book.reviews != null && <span>{book.reviews} reviews</span>}
      </div>

      <div className={styles.row}>
        {isLibrary ? (
          <>
            <div className={styles.priceBlock}>
              <span className={styles.deposit}>Refundable deposit</span>
              <span className={styles.price}>{formatKES(book.deposit || 0)}</span>
            </div>
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
                  dispatch(pushToast({ message: `“${book.title}” in Borrow bag` }));
                  dispatch(openDrawer('lending'));
                });
              }}
            >
              Borrow
            </button>
          </>
        ) : (
          <>
            <div className={styles.priceBlock}>
              <span className={styles.price}>{formatKES(book.price)}</span>
              {book.forLoan && (
                <span className={styles.deposit}>or dep. {formatKES(book.deposit)}</span>
              )}
            </div>
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
                  dispatch(pushToast({ message: `“${book.title}” in Buy bag` }));
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
