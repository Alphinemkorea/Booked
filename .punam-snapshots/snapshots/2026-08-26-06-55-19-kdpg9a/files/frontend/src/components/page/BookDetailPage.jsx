import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { BookCard } from '../shared/BookCard.jsx';
import { SafeImage } from '../shared/SafeImage.jsx';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { addPurchase, addLending, openDrawer } from '../../library/slices/cartSlice.js';
import { toggleWish } from '../../library/slices/wishlistSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { formatKES } from '../../library/json/booksData.js';
import { setIntent } from '../../library/helpers/intent.js';

export function BookDetailPage() {
  const { id } = useParams();
  const books = useAppSelector((s) => s.books.items);
  const user = useAppSelector((s) => s.auth.user);
  const wish = useAppSelector((s) => s.wishlist.ids);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState('synopsis');
  const book = books.find((b) => b.id === id);

  if (!book) {
    return (
      <div className="container empty-state">
        <h1 className="serif">Book not found</h1>
        <Link to="/shop" className="btn btn-primary">Back to shop</Link>
      </div>
    );
  }

  const similar = books.filter((b) => b.genre === book.genre && b.id !== book.id).slice(0, 4);
  const wished = wish.includes(book.id);

  const gate = (intent, fn) => {
    if (!user) {
      setIntent(intent);
      dispatch(pushToast({ message: 'Sign in to continue', tone: 'info' }));
      navigate('/login', { state: { from: `/book/${book.id}` } });
      return;
    }
    fn();
  };

  const buy = () =>
    gate({ type: 'buy', bookId: book.id, from: `/book/${book.id}` }, () => {
      dispatch(addPurchase({
        bookId: book.id, title: book.title, author: book.author,
        price: book.price, cover: book.cover, qty: 1,
      }));
      dispatch(pushToast({ message: 'Added to purchase cart' }));
      dispatch(openDrawer('purchase'));
    });

  const borrow = () =>
    gate({ type: 'lend', bookId: book.id, from: `/book/${book.id}` }, () => {
      dispatch(addLending({
        bookId: book.id, title: book.title, author: book.author,
        cover: book.cover, deposit: book.deposit, duration: book.loanDays || 14,
      }));
      dispatch(pushToast({ message: 'Added to lending cart' }));
      dispatch(openDrawer('lending'));
    });

  return (
    <div className="container page-enter" style={{ padding: '28px 0 100px' }}>
      <nav style={{ display: 'flex', gap: 8, fontSize: 15, color: 'var(--muted)', marginBottom: 28, fontWeight: 600 }}>
        <Link to="/shop" style={{ color: 'var(--primary)' }}>← Back</Link>
        <span>/</span>
        <span>{book.genre}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 340px) 1fr', gap: 48, alignItems: 'start' }}>
        <div style={{ background: 'var(--well)', borderRadius: 16, padding: 28, position: 'sticky', top: 'calc(var(--nav-h) + 16px)' }} className="hide-mobile">
          <SafeImage
            src={book.cover}
            alt={book.title}
            style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: 10, boxShadow: 'var(--shadow-lg)' }}
          />
          <button
            type="button"
            className="btn btn-outline btn-block"
            style={{ marginTop: 16 }}
            onClick={() => gate({ type: 'view', bookId: book.id }, () => dispatch(pushToast({ message: 'Chapter preview coming soon', tone: 'info' })))}
          >
            Preview chapter
          </button>
        </div>

        <div>
          <div style={{ maxWidth: 280, marginBottom: 20 }} className="hide-desktop">
            <SafeImage
              src={book.cover}
              alt={book.title}
              style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: 12, boxShadow: 'var(--shadow-md)' }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            <span className="chip chip-primary">{book.genre}</span>
            {book.forSale && <span className="chip chip-success">For sale</span>}
            {book.forLoan && <span className="chip chip-info">Borrowable</span>}
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.85rem)', marginBottom: 8 }}>{book.title}</h1>
          <p style={{ color: 'var(--muted)', margin: '0 0 10px', fontSize: '1.12rem' }}>
            by <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{book.author}</span>
          </p>
          <p style={{ color: 'var(--primary)', margin: '0 0 24px' }}>
            {'★'.repeat(Math.round(book.rating))} <strong>{book.rating}</strong>
            <span style={{ color: 'var(--muted)', fontWeight: 600, marginLeft: 6 }}>({book.reviews || 0} reviews)</span>
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              padding: 18,
              background: 'var(--well)',
              borderRadius: 16,
              marginBottom: 24,
            }}
            className="decision-strip"
          >
            <div>
              <span style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 6 }}>Why buy</span>
              <p style={{ margin: '0 0 10px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.45 }}>Own it forever. Annotate, reread, gift to a friend.</p>
              <strong className="price">{formatKES(book.price)}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 6 }}>Why borrow</span>
              <p style={{ margin: '0 0 10px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.45 }}>Try before you buy. {book.loanDays}-day loan with deposit refund.</p>
              <strong style={{ color: 'var(--info)' }}>Dep. {formatKES(book.deposit)}</strong>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 6 }}>Watch for</span>
              <p style={{ margin: '0 0 10px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.45 }}>Rated {book.rating}/5 · {book.pages} pages · {book.genre}.</p>
              <span style={{ color: 'var(--muted)', fontWeight: 600, fontSize: 14 }}>
                {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock for purchase'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }} className="hide-mobile">
            {book.forSale && (
              <button type="button" className="btn btn-primary" disabled={book.stock < 1} onClick={buy}>
                Buy — {formatKES(book.price)}
              </button>
            )}
            {book.forLoan && (
              <button type="button" className="btn btn-outline" onClick={borrow}>
                Borrow — dep. {formatKES(book.deposit)}
              </button>
            )}
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                gate({ type: 'wish', bookId: book.id }, () => {
                  dispatch(toggleWish(book.id));
                  dispatch(pushToast({ message: wished ? 'Removed from wishlist' : 'Saved to wishlist' }));
                })
              }
              aria-label="Wishlist"
            >
              <Heart size={18} fill={wished ? 'currentColor' : 'none'} color={wished ? '#e11d48' : 'currentColor'} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--line)', marginBottom: 16 }}>
            {['synopsis', 'details', 'reviews'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                style={{
                  border: 'none',
                  background: 'none',
                  padding: '12px 16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: tab === t ? 'var(--primary)' : 'var(--muted)',
                  borderBottom: tab === t ? '2px solid var(--primary)' : '2px solid transparent',
                  marginBottom: -1,
                  fontSize: 15,
                }}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '1.05rem', lineHeight: 1.65 }}>
            {tab === 'synopsis' && <p>{book.blurb}</p>}
            {tab === 'details' && (
              <dl style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: 0 }}>
                {[
                  ['ISBN', book.isbn],
                  ['Pages', book.pages],
                  ['Uploaded', book.uploadedAt],
                  ['Stock', book.stock],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: 'var(--well)', padding: 14, borderRadius: 12 }}>
                    <dt style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', fontWeight: 700 }}>{k}</dt>
                    <dd style={{ margin: '6px 0 0', fontWeight: 700 }}>{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {tab === 'reviews' && (
              <p style={{ color: 'var(--muted)' }}>
                Community reviews will appear here. Rated {book.rating} from {book.reviews || 0} readers.
              </p>
            )}
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section style={{ marginTop: 64 }}>
          <h2 className="serif" style={{ marginBottom: 22, fontSize: '1.75rem' }}>Similar in {book.genre}</h2>
          <div className="book-grid">
            {similar.map((b, i) => (
              <BookCard key={b.id} book={b} style={{ animationDelay: `${i * 50}ms` }} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile sticky CTA */}
      <div className="sticky-cta hide-desktop">
        {book.forSale && (
          <button type="button" className="btn btn-primary" style={{ flex: 1 }} disabled={book.stock < 1} onClick={buy}>
            Buy · {formatKES(book.price)}
          </button>
        )}
        {book.forLoan && (
          <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={borrow}>
            Borrow
          </button>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .decision-strip { grid-template-columns: 1fr !important; }
          .container > div[style*="grid-template-columns: minmax"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
