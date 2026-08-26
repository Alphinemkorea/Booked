import { Link } from 'react-router-dom';
import { Clock, CreditCard, BookOpen } from 'lucide-react';
import { BookCard } from '../shared/BookCard.jsx';
import { useAppSelector } from '../../library/storeHooks.js';
import { formatKES } from '../../library/json/booksData.js';

export function HomePage() {
  const books = useAppSelector((s) => s.books.items);
  const mode = useAppSelector((s) => s.books.mode);
  const user = useAppSelector((s) => s.auth.user);
  const loans = useAppSelector((s) => s.orders.loans);
  const purchases = useAppSelector((s) => s.orders.purchases);

  const featured = books.find((b) => b.featured) || books[2];
  const forYou = books.slice(0, 6);
  const trending = [...books].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const libraryRail = books.filter((b) => b.forLoan).slice(0, 6);

  const myActive = user
    ? loans.filter((l) => l.status === 'active' && l.userId === user.id)
    : [];
  const readyToPay = user
    ? purchases.filter((o) => o.status === 'approved' && o.userId === user.id)
    : [];
  const pendingLoans = user
    ? loans.filter((l) => l.status === 'pending' && l.userId === user.id)
    : [];

  return (
    <div className="page-enter">
      <section
        style={{
          minHeight: 460,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
          backgroundImage: `linear-gradient(105deg, rgba(15,14,13,.78) 0%, rgba(15,14,13,.4) 55%, transparent 100%), url(${featured.cover})`,
        }}
      >
        <div className="container" style={{ padding: '80px 0', maxWidth: 600 }}>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.85, marginBottom: 14 }}>
            Featured this month
          </p>
          <h1 className="serif" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', color: '#fff', marginBottom: 14 }}>
            {featured.title}
          </h1>
          <p style={{ opacity: 0.92, margin: '0 0 28px', fontSize: '1.12rem', lineHeight: 1.55, maxWidth: 480 }}>
            {featured.blurb}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link to={`/book/${featured.id}`} className="btn btn-primary">
              {mode === 'library' ? 'Borrow this book' : `Buy — ${formatKES(featured.price)}`}
            </Link>
            <Link
              to={mode === 'library' ? '/library' : '/shop'}
              className="btn btn-outline"
              style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}
            >
              Browse catalogue →
            </Link>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: '48px 0 28px' }}>
        {user && (myActive.length > 0 || readyToPay.length > 0 || pendingLoans.length > 0) && (
          <div className="status-rail" aria-label="Your status">
            {readyToPay.map((o) => (
              <Link key={o.id} to="/shelf?tab=purchases" className="status-ticket">
                <CreditCard size={20} color="var(--primary)" />
                <div>
                  <strong style={{ fontSize: 14 }}>Ready to pay</strong>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{formatKES(o.total)} · M-Pesa</div>
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
                      {days != null ? (days < 0 ? 'Overdue' : `Due in ${days} day${days === 1 ? '' : 's'}`) : 'Active loan'}
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

        {!user && (
          <div
            className="card"
            style={{
              padding: '20px 24px',
              marginBottom: 36,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              background: 'linear-gradient(120deg, var(--primary-soft), var(--card))',
              borderColor: 'color-mix(in srgb, var(--primary) 25%, var(--line))',
            }}
          >
            <div>
              <strong style={{ fontSize: '1.1rem' }}>Buy. Borrow. Belong.</strong>
              <p style={{ margin: '4px 0 0', color: 'var(--muted)' }}>
                Browse freely — sign in when you are ready to buy, borrow, or save.
              </p>
            </div>
            <Link to="/register" className="btn btn-primary">Create free account</Link>
          </div>
        )}

        <section style={{ marginBottom: 56 }}>
          <div className="section-head">
            <h2 className="serif">For you</h2>
            <Link to={mode === 'library' ? '/library' : '/shop'} className="link-orange">See all →</Link>
          </div>
          <div className="book-grid">
            {forYou.map((b, i) => (
              <BookCard
                key={b.id}
                book={b}
                variant={mode === 'library' ? 'library' : 'shop'}
                style={{ animationDelay: `${i * 55}ms` }}
              />
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <div className="section-head">
            <h2 className="serif">Trending now</h2>
          </div>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {trending.map((b, i) => (
              <li
                key={b.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 18px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
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

        <section style={{ marginBottom: 40 }}>
          <div className="section-head">
            <h2 className="serif">From the library</h2>
            <Link to="/library" className="link-orange">Browse loans →</Link>
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
