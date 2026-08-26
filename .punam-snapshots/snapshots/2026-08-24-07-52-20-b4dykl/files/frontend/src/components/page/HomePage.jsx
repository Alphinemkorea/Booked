import { Link } from 'react-router-dom';
import { BookCard } from '../shared/BookCard.jsx';
import { useAppSelector } from '../../library/storeHooks.js';
import { formatKES } from '../../library/json/booksData.js';

export function HomePage() {
  const books = useAppSelector((s) => s.books.items);
  const mode = useAppSelector((s) => s.books.mode);
  const featured = books.find((b) => b.featured) || books[2];
  const forYou = books.slice(0, 6);
  const trending = [...books].sort((a, b) => b.rating - a.rating).slice(0, 5);
  return (
    <div>
      <section style={{ minHeight: 440, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', color: '#fff',
        backgroundImage: `linear-gradient(105deg, rgba(28,25,23,.72), rgba(28,25,23,.35) 55%, transparent), url(${featured.cover})` }}>
        <div className="container" style={{ padding: '72px 0', maxWidth: 580 }}>
          <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.85 }}>Featured this month</p>
          <h1 className="serif" style={{ fontSize: 'clamp(2.2rem,4.5vw,3.25rem)', color: '#fff', margin: '14px 0' }}>{featured.title}</h1>
          <p style={{ opacity: 0.92, marginBottom: 28, fontSize: '1.1rem' }}>{featured.blurb}</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to={`/book/${featured.id}`} className="btn btn-primary">{mode === 'library' ? 'Borrow this book' : `Buy — ${formatKES(featured.price)}`}</Link>
            <Link to={mode === 'library' ? '/library' : '/shop'} className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,.55)', color: '#fff' }}>Browse all →</Link>
          </div>
        </div>
      </section>
      <div className="container" style={{ padding: '52px 0 28px' }}>
        <div className="section-head"><h2 className="serif">For you</h2><Link to="/shop" className="link-orange">See all →</Link></div>
        <div className="book-grid" style={{ marginBottom: 56 }}>
          {forYou.map((b, i) => <BookCard key={b.id} book={b} variant={mode === 'library' ? 'library' : 'shop'} style={{ animationDelay: `${i * 60}ms` }} />)}
        </div>
        <div className="section-head"><h2 className="serif">Trending now</h2></div>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {trending.map((b, i) => (
            <li key={b.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px' }}>
              <span style={{ fontWeight: 800, color: 'var(--primary)', width: 28 }}>{i + 1}</span>
              <img src={b.cover} alt="" style={{ width: 44, height: 62, objectFit: 'cover', borderRadius: 5 }} />
              <div style={{ flex: 1 }}><Link to={`/book/${b.id}`}><strong>{b.title}</strong></Link><div style={{ color: 'var(--muted)', fontSize: 14 }}>{b.author}</div></div>
              <div style={{ textAlign: 'right' }}><span className="price">{formatKES(b.price)}</span><div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 14 }}>★ {b.rating}</div></div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
