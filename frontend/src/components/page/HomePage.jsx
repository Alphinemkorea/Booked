import { Link } from 'react-router-dom';
import { Clock, CreditCard, BookOpen, ArrowRight, Sparkles, Zap, Shield, Smartphone } from 'lucide-react';
import { BookCard } from '../shared/BookCard.jsx';
import { useAppSelector } from '../../library/storeHooks.js';
import { formatKES } from '../../library/json/booksData.js';
import { getContinueReading, getProgress } from '../../library/helpers/readingProgress.js';

export function HomePage() {
  const books = useAppSelector((s) => s.books.items) || [];
  const mode = useAppSelector((s) => s.books.mode);
  const user = useAppSelector((s) => s.auth.user);
  const loans = useAppSelector((s) => s.orders.loans) || [];
  const purchases = useAppSelector((s) => s.orders.purchases) || [];
  const wishIds = useAppSelector((s) => s.wishlist.ids) || [];

  const featured = books.find((b) => b.featured) || books[0];
  if (!books.length || !featured) {
    return (
      <div className="container" style={{ padding: 48, textAlign: 'center' }}>
        <h1 className="serif">Loading catalogue…</h1>
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
  const staff = books.filter((b) => b.featured || b.rating >= 4.8).slice(0, 4);

  const myActive = user ? loans.filter((l) => l.status === 'active' && l.userId === user.id) : [];
  const readyToPay = user
    ? [
        ...purchases.filter((o) => o.status === 'approved' && o.userId === user.id).map((o) => ({ kind: 'purchase', ...o })),
        ...loans.filter((l) => l.status === 'approved' && l.userId === user.id).map((l) => ({ kind: 'loan', ...l })),
      ]
    : [];
  const pendingLoans = user ? loans.filter((l) => l.status === 'pending' && l.userId === user.id) : [];

  const continueList = getContinueReading(user?.id)
    .map((c) => {
      const book = books.find((b) => b.id === c.bookId);
      if (!book) return null;
      const prog = getProgress(user?.id, c.bookId);
      const chapters = 3;
      const ch = Number(prog?.chapter) || 0;
      const pct = Math.round(((ch + 1) / chapters) * 100);
      return { book, pct, chapter: ch + 1 };
    })
    .filter(Boolean)
    .slice(0, 2);

  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

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
          position: 'relative',
          backgroundImage: `linear-gradient(105deg, rgba(15,14,13,.84) 0%, rgba(15,14,13,.4) 55%, transparent 100%), url(${featured.cover})`,
        }}
      >
        <div className="container" style={{ padding: '80px 0', maxWidth: 620 }}>
          {user && (
            <p style={{ margin: '0 0 10px', opacity: 0.9, fontWeight: 600, fontSize: 15 }}>
              {hello}, {user.name?.split(' ')[0]}
            </p>
          )}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999,
            background: 'rgba(255,87,34,0.92)', fontSize: 12, fontWeight: 800, letterSpacing: '0.06em',
            textTransform: 'uppercase', marginBottom: 14,
          }}>
            <Sparkles size={14} /> Staff pick
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', color: '#fff', marginBottom: 12 }}>
            {featured.title}
          </h1>
          <p style={{ opacity: 0.92, margin: '0 0 8px', fontSize: '1.05rem' }}>by {featured.author}</p>
          <p style={{ opacity: 0.88, margin: '0 0 24px', fontSize: '1.05rem', lineHeight: 1.55, maxWidth: 460 }}>
            {featured.blurb}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link to={`/book/${featured.id}`} className="btn btn-primary">
              {mode === 'library' ? 'Borrow this book' : `View · ${formatKES(featured.price)}`}
            </Link>
            <Link to="/library" className="btn btn-outline" style={{ borderColor: 'rgba(255,255,255,0.45)', color: '#fff' }}>
              Explore library
            </Link>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: '36px 0 28px' }}>
        <div className="trust-row">
          <span><Smartphone size={14} /> Instant digital access</span>
          <span><Zap size={14} /> M-Pesa after approval</span>
          <span><Shield size={14} /> No shipping · read in browser</span>
        </div>

        {continueList.length > 0 && (
          <section style={{ marginBottom: 28 }}>
            <div className="section-head">
              <h2 className="serif" style={{ fontSize: '1.35rem' }}>Continue reading</h2>
            </div>
            {continueList.map(({ book, pct, chapter }) => (
              <Link key={book.id} to={`/read/${book.id}`} className="continue-card">
                <img src={book.cover} alt="" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ display: 'block' }}>{book.title}</strong>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>Chapter {chapter} · {pct}% through sample</span>
                  <div className="progress-thin"><i style={{ width: `${pct}%` }} /></div>
                </div>
                <span className="btn btn-primary btn-sm">Resume</span>
              </Link>
            ))}
          </section>
        )}

        {user && (myActive.length > 0 || readyToPay.length > 0 || pendingLoans.length > 0) && (
          <div className="status-rail" aria-label="Your activity" style={{ marginBottom: 28 }}>
            {readyToPay.map((item) => (
              <Link
                key={item.id}
                to={item.kind === 'loan' ? '/shelf?tab=borrowing' : '/shelf?tab=purchases'}
                className="status-ticket"
              >
                <CreditCard size={20} color="var(--primary)" />
                <div>
                  <strong style={{ fontSize: 14 }}>{item.kind === 'loan' ? 'Pay deposit' : 'Ready to pay'}</strong>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                    {item.kind === 'loan' ? `${item.title} · ${formatKES(item.deposit)}` : `${formatKES(item.total)} · M-Pesa`}
                  </div>
                </div>
              </Link>
            ))}
            {myActive.map((l) => {
              const days = l.dueAt ? Math.ceil((l.dueAt - Date.now()) / 86400000) : null;
              return (
                <Link key={l.id} to={`/read/${l.bookId}`} className="status-ticket">
                  <Clock size={20} color={days != null && days <= 3 ? 'var(--warning)' : 'var(--info)'} />
                  <div>
                    <strong style={{ fontSize: 14 }}>{l.title}</strong>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                      {days != null ? (days < 0 ? 'Overdue' : `Due in ${days}d · Tap to read`) : 'Active · Tap to read'}
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

        {!user ? (
          <div className="card" style={{
            padding: '22px 26px', marginBottom: 36, display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'space-between', gap: 16,
            background: 'linear-gradient(120deg, var(--primary-soft), var(--card))',
            borderColor: 'color-mix(in srgb, var(--primary) 25%, var(--line))',
          }}>
            <div>
              <strong style={{ fontSize: '1.15rem' }}>Browse free. Sign in to buy, borrow, or save.</strong>
              <p style={{ margin: '6px 0 0', color: 'var(--muted)', maxWidth: 420, fontSize: 14 }}>
                Sample pages without an account. Full books unlock after payment — instant in your browser.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/register" className="btn btn-primary">Create free account</Link>
              <Link to="/login" className="btn btn-ghost">Sign in</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 36 }}>
            {[
              { to: '/shop', label: 'Shop', sub: 'Own digital', icon: '🛒' },
              { to: '/library', label: 'Library', sub: 'Timed loans', icon: '📚' },
              { to: '/shelf?tab=wishlist', label: 'Wishlist', sub: `${wishIds.length} saved`, icon: '♥' },
              { to: '/shelf', label: 'My Shelf', sub: 'Orders & loans', icon: '📖' },
            ].map((q) => (
              <Link key={q.to} to={q.to} className="card" style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{q.icon}</div>
                <strong>{q.label}</strong>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{q.sub}</div>
              </Link>
            ))}
          </div>
        )}

        {user?.genres?.length > 0 && (
          <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 12, fontWeight: 600 }}>
            For you · based on {user.genres.slice(0, 3).join(', ')}
          </p>
        )}

        <section style={{ marginBottom: 48 }}>
          <div className="section-head">
            <h2 className="serif">For you</h2>
            <Link to={mode === 'library' ? '/library' : '/shop'} className="link-orange">See all →</Link>
          </div>
          <div className="book-grid">
            {forYou.map((b, i) => (
              <BookCard key={b.id} book={b} variant={mode === 'library' ? 'library' : 'shop'} style={{ animationDelay: `${i * 45}ms` }} />
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 48 }}>
          <div className="section-head">
            <h2 className="serif">Staff picks this week</h2>
          </div>
          <p style={{ color: 'var(--muted)', marginTop: -8, marginBottom: 16, fontSize: 14 }}>
            Curated for readers who want substance with their story.
          </p>
          <div className="book-grid">
            {staff.map((b, i) => (
              <BookCard key={b.id} book={b} style={{ animationDelay: `${i * 40}ms` }} />
            ))}
          </div>
        </section>

        {under1000.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <div className="section-head">
              <h2 className="serif">Under KES 1,000</h2>
              <Link to="/shop" className="link-orange">Shop deals →</Link>
            </div>
            <div className="book-grid">
              {under1000.map((b, i) => (
                <BookCard key={b.id} book={b} style={{ animationDelay: `${i * 40}ms` }} />
              ))}
            </div>
          </section>
        )}

        <section style={{ marginBottom: 48 }}>
          <div className="section-head">
            <h2 className="serif">Trending now</h2>
          </div>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {trending.map((b, i) => (
              <li key={b.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px' }}>
                <span style={{ fontWeight: 800, color: 'var(--muted)', width: 24 }}>{i + 1}</span>
                <img src={b.cover} alt="" style={{ width: 40, height: 58, objectFit: 'cover', borderRadius: 5, boxShadow: 'var(--shadow)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/book/${b.id}`}><strong>{b.title}</strong></Link>
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>{b.author}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="price">{formatKES(b.price)}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>★ {b.rating}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section style={{ marginBottom: 48 }}>
          <div className="section-head">
            <h2 className="serif">New arrivals</h2>
            <Link to="/shop" className="link-orange">Browse shop →</Link>
          </div>
          <div className="book-grid">
            {newArrivals.map((b, i) => (
              <BookCard key={b.id} book={b} style={{ animationDelay: `${i * 40}ms` }} />
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 36 }}>
          <div className="card" style={{
            padding: '26px 22px', marginBottom: 20,
            background: 'linear-gradient(135deg, var(--info-soft), var(--card))',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, alignItems: 'center',
          }}>
            <div>
              <h2 className="serif" style={{ fontSize: '1.5rem', marginBottom: 6 }}>From the library</h2>
              <p style={{ margin: 0, color: 'var(--muted)', maxWidth: 400, fontSize: 14 }}>
                Digital loan → read in browser → access locks when time ends. Deposit refunded on return.
              </p>
            </div>
            <Link to="/library" className="btn btn-primary">
              Browse library <ArrowRight size={16} />
            </Link>
          </div>
          <div className="book-grid">
            {libraryRail.map((b, i) => (
              <BookCard key={b.id} book={b} variant="library" style={{ animationDelay: `${i * 45}ms` }} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
