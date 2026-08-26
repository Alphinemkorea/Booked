import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { BookCard } from '../shared/BookCard.jsx';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { addPurchase, addLending, openDrawer } from '../../library/slices/cartSlice.js';
import { toggleWish } from '../../library/slices/wishlistSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { formatKES } from '../../library/json/booksData.js';

export function BookDetailPage() {
  const { id } = useParams();
  const book = useAppSelector((s) => s.books.items.find((b) => b.id === id));
  const books = useAppSelector((s) => s.books.items);
  const user = useAppSelector((s) => s.auth.user);
  const wish = useAppSelector((s) => s.wishlist.ids);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState('synopsis');
  if (!book) return <div className="container empty-state"><h1 className="serif">Book not found</h1><Link to="/shop" className="btn btn-primary">Back</Link></div>;
  const similar = books.filter((b) => b.genre === book.genre && b.id !== book.id).slice(0, 4);
  const wished = wish.includes(book.id);
  const gate = (fn) => { if (!user) { dispatch(pushToast({ message: 'Sign in to continue', tone: 'info' })); navigate('/login', { state: { from: `/book/${book.id}` } }); return; } fn(); };
  return (
    <div className="container" style={{ padding: '28px 0 56px' }}>
      <nav style={{ display: 'flex', gap: 8, color: 'var(--muted)', marginBottom: 28, fontWeight: 600 }}><Link to="/shop" style={{ color: 'var(--primary)' }}>← Back</Link><span>/</span><span>{book.genre}</span></nav>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px,340px) 1fr', gap: 48, alignItems: 'start' }}>
        <div style={{ background: 'var(--well)', borderRadius: 16, padding: 28, position: 'sticky', top: 'calc(var(--nav-h) + 16px)' }}>
          <img src={book.cover} alt={book.title} style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: 10, boxShadow: 'var(--shadow-md)' }} />
          <button type="button" className="btn btn-outline btn-block" style={{ marginTop: 16 }} onClick={() => gate(() => dispatch(pushToast({ message: 'Chapter preview coming soon', tone: 'info' })))}>Preview chapter</button>
        </div>
        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <span className="chip chip-primary">{book.genre}</span>
            {book.forSale && <span className="chip chip-success">For sale</span>}
            {book.forLoan && <span className="chip chip-info">Borrowable</span>}
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(2rem,3.5vw,2.75rem)', marginBottom: 8 }}>{book.title}</h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>by <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{book.author}</span></p>
          <p style={{ color: 'var(--primary)', margin: '10px 0 24px' }}>{'★'.repeat(Math.round(book.rating))} <strong>{book.rating}</strong> <span style={{ color: 'var(--muted)' }}>({book.reviews || 0} reviews)</span></p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, padding: 18, background: 'var(--well)', borderRadius: 16, marginBottom: 24 }}>
            <div><span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)' }}>Why buy</span><p style={{ margin: '6px 0 10px', fontSize: 15, color: 'var(--muted)' }}>Own it forever. Annotate, reread, gift to a friend.</p><strong className="price">{formatKES(book.price)}</strong></div>
            <div><span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)' }}>Why borrow</span><p style={{ margin: '6px 0 10px', fontSize: 15, color: 'var(--muted)' }}>Try before you buy. {book.loanDays}-day loan with deposit refund.</p><strong style={{ color: 'var(--info)' }}>Dep. {formatKES(book.deposit)}</strong></div>
            <div><span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted)' }}>Watch for</span><p style={{ margin: '6px 0 10px', fontSize: 15, color: 'var(--muted)' }}>Rated {book.rating}/5 · {book.pages} pages · {book.genre}.</p><span style={{ color: 'var(--muted)', fontWeight: 600 }}>{book.stock > 0 ? 'Available in print.' : 'Out of stock.'}</span></div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
            {book.forSale && <button type="button" className="btn btn-primary" disabled={book.stock < 1} onClick={() => gate(() => { dispatch(addPurchase({ bookId: book.id, title: book.title, author: book.author, price: book.price, cover: book.cover, qty: 1 })); dispatch(pushToast({ message: 'Added to purchase cart' })); dispatch(openDrawer('purchase')); })}>Buy — {formatKES(book.price)}</button>}
            {book.forLoan && <button type="button" className="btn btn-outline" onClick={() => gate(() => { dispatch(addLending({ bookId: book.id, title: book.title, author: book.author, cover: book.cover, deposit: book.deposit, duration: book.loanDays || 14 })); dispatch(pushToast({ message: 'Added to lending cart' })); dispatch(openDrawer('lending')); })}>Borrow — dep. {formatKES(book.deposit)}</button>}
            <button type="button" className="btn btn-ghost" onClick={() => gate(() => { dispatch(toggleWish(book.id)); dispatch(pushToast({ message: wished ? 'Removed from wishlist' : 'Saved to wishlist' })); })}><Heart size={18} fill={wished ? 'currentColor' : 'none'} color={wished ? '#e11d48' : 'currentColor'} /></button>
          </div>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', marginBottom: 16 }}>
            {['synopsis', 'details', 'reviews'].map((t) => (
              <button key={t} type="button" onClick={() => setTab(t)} style={{ border: 'none', background: 'none', padding: '12px 16px', fontWeight: 700, cursor: 'pointer', color: tab === t ? 'var(--primary)' : 'var(--muted)', borderBottom: tab === t ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: -1 }}>{t[0].toUpperCase() + t.slice(1)}</button>
            ))}
          </div>
          {tab === 'synopsis' && <p style={{ fontSize: '1.05rem', lineHeight: 1.65 }}>{book.blurb}</p>}
          {tab === 'details' && <p>ISBN {book.isbn} · {book.pages} pages · Uploaded {book.uploadedAt} · Stock {book.stock}</p>}
          {tab === 'reviews' && <p style={{ color: 'var(--muted)' }}>Rated {book.rating} from {book.reviews || 0} readers.</p>}
        </div>
      </div>
      {similar.length > 0 && (
        <section style={{ marginTop: 64 }}>
          <h2 className="serif" style={{ marginBottom: 22, fontSize: '1.75rem' }}>Similar in {book.genre}</h2>
          <div className="book-grid">{similar.map((b, i) => <BookCard key={b.id} book={b} style={{ animationDelay: `${i * 50}ms` }} />)}</div>
        </section>
      )}
    </div>
  );
}
