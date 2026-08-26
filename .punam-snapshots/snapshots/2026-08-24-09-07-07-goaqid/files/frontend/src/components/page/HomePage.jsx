import { Link } from 'react-router-dom';
import { Clock, CreditCard, BookOpen, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { BookCard } from '../shared/BookCard.jsx';
import { useAppSelector } from '../../library/storeHooks.js';
import { formatKES } from '../../library/json/booksData.js';

export function HomePage() {
  const books = useAppSelector((s) => s.books.items);
  const mode = useAppSelector((s) => s.books.mode);
  const user = useAppSelector((s) => s.auth.user);
  const loans = useAppSelector((s) => s.orders.loans);
  const purchases = useAppSelector((s) => s.orders.purchases);
  const wishIds = useAppSelector((s) => s.wishlist.ids);

  const featured = books.find((b) => b.featured) || books[0];
  if (!books?.length || !featured) {
    return (
      <div className="container" style={{ padding: 48, textAlign: 'center' }}>
        <h1 className="serif">Loading catalogue…</h1>
        <p style={{ color: 'var(--muted)' }}>If this stays blank, clear site data for localhost and refresh.</p>
      </div>
    );
  }
  const forYou = user?.genres?.length
    ? [...books].sort((a, b) => (user.genres.includes(b.genre) ? 1 : 0) - (user.genres.includes(a.genre) ? 1 : 0)).slice(0, 6)
    : books.slice(0, 6);
  const trending = [...books].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const libraryRail = books.filter((b) => b.forLoan).slice(0, 6);
  const under1000 = books.filter((b) => b.forSale && b.price <= 1000).slice(0, 4);
  const newArrivals = [...books].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0, 6);

  const myActive = user ? loans.filter((l) => l.status === 'active' && l.userId === user.id) : [];
  const readyToPay = user
    ? [
        ...purchases.filter((o) => o.status === 'approved' && o.userId === user.id).map((o) => ({ kind: 'purchase', ...o })),
        ...loans.filter((l) => l.status === 'approved' && l.userId === user.id).map((l) => ({ kind: 'loan', ...l })),
      ]
    : [];
  const pendingLoans = user ? loans.filter((l) => l.status === 'pending' && l.userId === user.id) : [];

  return (
    <div className="page-enter">
      {/* Hero */}
      <section
        style={{
          minHeight: 480,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
          position: 'relative',
          backgroundImage: `linear-gradient(105deg, rgba(15,14,13,.82) 0%, rgba(15,14,13,.45) 50%, transparent 100%), url(${featured.cover})`,
        }}
      >
        <div className="container" style={{ padding: '88px 0', maxWidth: 620 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: 'rgba(255,87,34,0.9)', fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>
            <Sparkles size={14} /> Staff pick
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#fff', marginBottom: 14 }}>
            {featured.title}
          </h1>
          <p style={{ opacity: 0.92, margin: '0 0 10px', fontSize: '1.05rem' }}>by {featured.author}</p>
          <p style={{ opacity: 0.88, margin: '0 0 28px', fontSize: '1.1rem', lineHeight: 1.55, maxWidth: 480 }}>
            {featured.blurb}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link to={`/book/${featured.id}`} className="btn btn-primary">
              {mode === 'library' ? 'Borrow this book' : `Buy — ${formatKES(featured.price)}`}
            </Link>
            <Link to="/library" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>
              Explore library
            </Link>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: '40px 0 28px' }}>
        {/* Status rail */}
        {user && (myActive.length > 0 || readyToPay.length > 0 || pendingLoans.length > 0) && (
          <div className="status-rail" aria-label="Your activity">
            {readyToPay.map((item) => (
              <Link
                key={item.id}
                to={item.kind === 'loan' ? '/shelf?tab=borrowing' : '/shelf?tab=purchases'}
                className="status-ticket"
              >
                <CreditCard size={20} color="var(--primary)" />
                <div>
                  <strong style={{ fontSize: 14 }}>
                    {item.kind === 'loan' ? 'Pay deposit' : 'Ready to pay'}
                  </strong>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                    {item.kind === 'loan'
                      ? `${item.title} · ${formatKES(item.deposit)}`
                      : `${formatKES(item.total)} · M-Pesa`}
                  </div>
                </div>
              </Link>
            ))}
            {myActive.map((l) => {
              const days = l.dueAt ? Math.ceil((l.dueAt - Date.now()) / 86400000) : null;
              return (
                <Link key={l.id} to="/shelf?tab=borrowing" className="status-ticket">
                  <Clock size={20} color={days != null && days <= 3 ? 'var(--warning)' : 'var(--info)'} />
                  <div>
                    <strong style={{ fontSize: 14 }}>{l.title}</strong>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                      {days != null ? (days < 0 ? 'Overdue — return now' : `Due in ${days} day${days === 1 ? '' : 's'}`) : 'Active loan'}
                    </div>
                  </div>
                </Link>
              );
            })}
            {pendingLoans.map((l) => (
              <Link key={l.id} to="/shelf?tab=borrowing" className="status-ticket">
                <BookOpen size={20} color="var(--warning)" />
                <div>
                  <strong style={{ fontSize: 14 }}>Awaiting approval</strong>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{l.title}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Guest / value prop */}
        {!user ? (
          <div
            className="card"
            style={{
              padding: '24px 28px',
              marginBottom: 40,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              background: 'linear-gradient(120deg, var(--primary-soft), var(--card))',
              borderColor: 'color-mix(in srgb, var(--primary) 28%, var(--line))',
            }}
          >
            <div>
              <strong style={{ fontSize: '1.2rem' }}>Buy. Borrow. Belong.</strong>
              <p style={{ margin: '6px 0 0', color: 'var(--muted)', maxWidth: 480 }}>
                Browse the full catalogue. Sign in to buy, borrow, or save to your wishlist. Payments via M-Pesa after approval.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/register" className="btn btn-primary">Create free account</Link>
              <Link to="/login" className="btn btn-ghost">Sign in</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 40 }}>
            {[
              { to: '/shop', label: 'Shop', sub: 'Own a copy', icon: '🛒' },
              { to: '/library', label: 'Library', sub: 'Borrow & return', icon: '📚' },
              { to: '/shelf?tab=wishlist', label: 'Wishlist', sub: `${wishIds.length} saved`, icon: '♥' },
              { to: '/shelf', label: 'My Shelf', sub: 'Orders & loans', icon: '📖' },
            ].map((q) => (
              <Link key={q.to} to={q.to} className="card" style={{ padding: '16px 18px', transition: 'transform 0.2s' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{q.icon}</div>
                <strong>{q.label}</strong>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{q.sub}</div>
              </Link>
            ))}
          </div>
        )}

        {/* For you */}
        <section style={{ marginBottom: 56 }}>
          <div className="section-head">
            <h2 className="serif">For you</h2>
            <Link to={mode === 'library' ? '/library' : '/shop'} className="link-orange">See all →</Link>
          </div>
          <div className="book-grid">
            {forYou.map((b, i) => (
              <BookCard key={b.id} book={b} variant={mode === 'library' ? 'library' : 'shop'} style={{ animationDelay: `${i * 50}ms` }} />
            ))}
          </div>
        </section>

        {/* Under 1000 */}
        {under1000.length > 0 && (
          <section style={{ marginBottom: 56 }}>
            <div className="section-head">
              <h2 className="serif">Under KES 1,000</h2>
              <Link to="/shop" className="link-orange">Shop deals →</Link>
            </div>
            <div className="book-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
              {under1000.map((b, i) => (
                <BookCard key={b.id} book={b} style={{ animationDelay: `${i * 40}ms` }} />
              ))}
            </div>
          </section>
        )}

        {/* Trending ranked */}
        <section style={{ marginBottom: 56 }}>
          <div className="section-head">
            <h2 className="serif">Trending now</h2>
          </div>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {trending.map((b, i) => (
              <li key={b.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px' }}>
                <span style={{ fontWeight: 800, color: 'var(--primary)', width: 28, fontSize: '1.15rem' }}>{i + 1}</span>
                <img src={b.cover} alt="" style={{ width: 44, height: 62, objectFit: 'cover', borderRadius: 5 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/book/${b.id}`}><strong>{b.title}</strong></Link>
                  <div style={{ color: 'var(--muted)', fontSize: 14 }}>{b.author}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="price">{formatKES(b.price)}</div>
                  {b.forLoan && <div style={{ fontSize: 12, color: 'var(--muted)' }}>Borrow available</div>}
                  <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 14 }}>★ {b.rating}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* New arrivals */}
        <section style={{ marginBottom: 56 }}>
          <div className="section-head">
            <h2 className="serif">New arrivals</h2>
            <Link to="/shop" className="link-orange">Browse shop →</Link>
          </div>
          <div className="book-grid">
            {newArrivals.map((b, i) => (
              <BookCard key={b.id} book={b} style={{ animationDelay: `${i * 45}ms` }} />
            ))}
          </div>
        </section>

        {/* Library */}
        <section style={{ marginBottom: 40 }}>
          <div
            className="card"
            style={{
              padding: '28px 24px',
              marginBottom: 24,
              background: 'linear-gradient(135deg, var(--info-soft), var(--card))',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: 16,
              alignItems: 'center',
            }}
          >
            <div>
              <h2 className="serif" style={{ fontSize: '1.6rem', marginBottom: 6 }}>From the library</h2>
              <p style={{ margin: 0, color: 'var(--muted)', maxWidth: 420 }}>
                Try before you buy. Request a loan → admin approves → pay deposit on M-Pesa → read → return for full refund.
              </p>
            </div>
            <Link to="/library" className="btn btn-primary">
              Browse library <ArrowRight size={16} />
            </Link>
          </div>
          <div className="book-grid">
            {libraryRail.map((b, i) => (
              <BookCard key={b.id} book={b} variant="library" style={{ animationDelay: `${i * 50}ms` }} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
