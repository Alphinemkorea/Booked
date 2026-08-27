import { Link } from 'react-router-dom';
import { Clock, CreditCard, BookOpen, ArrowRight, Sparkles, Zap, Shield, Smartphone } from 'lucide-react';
import { BookCard } from '../shared/BookCard.jsx';
import { useAppSelector } from '../../library/storeHooks.js';
import { formatKES } from '../../library/json/booksData.js';
import { getContinueReading, getProgress } from '../../library/helpers/readingProgress.js';
import styles from '../../styles/components/page/HomePage.module.css';

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
      <div className={styles.loading}>
        <h1 className="serif">Loading catalogue…</h1>
      </div>
    );
  }

  const forYou = user?.genres?.length
    ? [...books].sort((a, b) => (user.genres.includes(b.genre) ? 1 : 0) - (user.genres.includes(a.genre) ? 1 : 0)).slice(0, 4)
    : books.slice(0, 4);
  const trending = [...books].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const libraryRail = books.filter((b) => b.forLoan).slice(0, 4);
  const under1000 = books.filter((b) => b.forSale && b.price <= 1000).slice(0, 4);
  const newArrivals = [...books].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).slice(0, 4);
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
      const ch = Number(prog?.chapter) || 0;
      const pct = Math.round(((ch + 1) / 3) * 100);
      return { book, pct, chapter: ch + 1 };
    })
    .filter(Boolean)
    .slice(0, 2);

  const hour = new Date().getHours();
  const hello = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className={`${styles.page} page-enter`}>
      <section className={styles.hero}>
        <div
          className={styles.heroBg}
          style={{ backgroundImage: featured.cover ? `url(${featured.cover})` : 'none' }}
        />
        <div className={styles.heroShade} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            {user && (
              <p className={styles.greeting}>
                {hello}, {user.name?.split(' ')[0]}
              </p>
            )}
            <div className={styles.kicker}>
              <Sparkles size={14} /> Staff pick
            </div>
            <h1 className={`serif ${styles.title}`}>{featured.title}</h1>
            <p className={styles.author}>by {featured.author}</p>
            <p className={styles.blurb}>{featured.blurb}</p>
            <div className={styles.actions}>
              <Link to={`/book/${featured.id}`} className="btn btn-primary">
                {mode === 'library' ? 'Borrow this book' : `View · ${formatKES(featured.price)}`}
              </Link>
              <Link to="/library" className="btn btn-outline btn-ghost-light">
                Explore library
              </Link>
            </div>
          </div>
          {featured.cover && (
            <div className={styles.heroCoverCard}>
              <img src={featured.cover} alt="" />
            </div>
          )}
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.trustRow}>
          <span>
            <Smartphone size={16} /> Instant digital access
          </span>
          <span>
            <Zap size={16} /> M-Pesa after approval
          </span>
          <span>
            <Shield size={16} /> No shipping · read in browser
          </span>
        </div>

        {continueList.length > 0 && (
          <section className={styles.continueSection}>
            <h2 className="serif">Continue reading</h2>
            {continueList.map(({ book, pct, chapter }) => (
              <Link key={book.id} to={`/read/${book.id}`} className="continue-card">
                <img src={book.cover} alt="" />
                <div className="u-flex-1">
                  <strong className="u-block">{book.title}</strong>
                  <span className="u-fs-13 u-muted">
                    Chapter {chapter} · {pct}% through sample
                  </span>
                  <div className="progress-thin" style={{ '--progress': `${pct}%` }}>
                    <i className="progress-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <span className="btn btn-primary btn-sm">Resume</span>
              </Link>
            ))}
          </section>
        )}

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
                  <strong className="u-fs-14">{item.kind === 'loan' ? 'Pay deposit' : 'Ready to pay'}</strong>
                  <div className="u-fs-13 u-muted">
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
                <Link key={l.id} to={`/read/${l.bookId}`} className="status-ticket">
                  <Clock size={20} color={days != null && days <= 3 ? 'var(--warning)' : 'var(--info)'} />
                  <div>
                    <strong className="u-fs-14">{l.title}</strong>
                    <div className="u-fs-13 u-muted">
                      {days != null
                        ? days < 0
                          ? 'Overdue'
                          : `Due in ${days}d · Tap to read`
                        : 'Active · Tap to read'}
                    </div>
                  </div>
                </Link>
              );
            })}
            {pendingLoans.map((l) => (
              <Link key={l.id} to="/shelf?tab=borrowing" className="status-ticket">
                <BookOpen size={20} color="var(--warning)" />
                <div>
                  <strong className="u-fs-14">Awaiting approval</strong>
                  <div className="u-fs-13 u-muted">{l.title}</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!user ? (
          <div className="card guest-banner">
            <div>
              <strong className="u-fs-15">Browse free. Sign in to buy, borrow, or save.</strong>
              <p className="u-muted u-fs-14 u-m-0" style={{ marginTop: 6, maxWidth: 420 }}>
                Sample pages without an account. Full books unlock after payment — instant in your browser.
              </p>
            </div>
            <div className="u-flex u-gap-10">
              <Link to="/register" className="btn btn-primary">
                Create free account
              </Link>
              <Link to="/login" className="btn btn-ghost">
                Sign in
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.quickGrid}>
            {[
              { to: '/shop', label: 'Shop', sub: 'Own digital', icon: '🛒' },
              { to: '/library', label: 'Library', sub: 'Timed loans', icon: '📚' },
              { to: '/shelf?tab=wishlist', label: 'Wishlist', sub: `${wishIds.length} saved`, icon: '♥' },
              { to: '/shelf', label: 'My Shelf', sub: 'Orders & loans', icon: '📖' },
            ].map((q) => (
              <Link key={q.to} to={q.to} className={styles.quickCard}>
                <div className={styles.quickIcon}>{q.icon}</div>
                <span className={styles.quickLabel}>{q.label}</span>
                <span className={styles.quickSub}>{q.sub}</span>
              </Link>
            ))}
          </div>
        )}

        {user?.genres?.length > 0 && (
          <p className={styles.forYouNote}>For you · based on {user.genres.slice(0, 3).join(', ')}</p>
        )}

        <section className={styles.railSection}>
          <div className={styles.sectionHead}>
            <h2 className="serif">For you</h2>
            <Link to={mode === 'library' ? '/library' : '/shop'} className="link-orange">
              See all →
            </Link>
          </div>
          <div className={styles.bookGrid}>
            {forYou.map((b, i) => (
              <BookCard
                key={b.id}
                book={b}
                variant={mode === 'library' ? 'library' : 'shop'}
                className={`delay-${Math.min(i, 9)}`}
              />
            ))}
          </div>
        </section>

        <section className={styles.railSection}>
          <div className={styles.sectionHead}>
            <h2 className="serif">Staff picks this week</h2>
          </div>
          <p className={styles.staffNote}>Curated for readers who want substance with their story.</p>
          <div className={styles.bookGrid}>
            {staff.map((b, i) => (
              <BookCard key={b.id} book={b} className={`delay-${Math.min(i, 9)}`} />
            ))}
          </div>
        </section>

        {under1000.length > 0 && (
          <section className={styles.railSection}>
            <div className={styles.sectionHead}>
              <h2 className="serif">Under KES 1,000</h2>
              <Link to="/shop" className="link-orange">
                Shop deals →
              </Link>
            </div>
            <div className={styles.bookGrid}>
              {under1000.map((b, i) => (
                <BookCard key={b.id} book={b} className={`delay-${Math.min(i, 9)}`} />
              ))}
            </div>
          </section>
        )}

        <section className={styles.railSection}>
          <div className={styles.sectionHead}>
            <h2 className="serif">Trending now</h2>
          </div>
          <ol className="rank-list">
            {trending.map((b, i) => (
              <li key={b.id} className="card rank-item">
                <span className="rank-num">{i + 1}</span>
                <img src={b.cover} alt="" className="thumb-cover-sm" />
                <div className="u-flex-1">
                  <Link to={`/book/${b.id}`}>
                    <strong>{b.title}</strong>
                  </Link>
                  <div className="u-muted u-fs-13">{b.author}</div>
                </div>
                <div className="u-text-right">
                  <div className="price">{formatKES(b.price)}</div>
                  <div className="u-fs-13 u-muted">★ {b.rating}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.railSection}>
          <div className={styles.sectionHead}>
            <h2 className="serif">New arrivals</h2>
            <Link to="/shop" className="link-orange">
              Browse shop →
            </Link>
          </div>
          <div className={styles.bookGrid}>
            {newArrivals.map((b, i) => (
              <BookCard key={b.id} book={b} className={`delay-${Math.min(i, 9)}`} />
            ))}
          </div>
        </section>

        <section className={styles.railSection}>
          <div className="card library-cta">
            <div>
              <h2 className="serif" style={{ fontSize: '1.5rem', marginBottom: 6 }}>
                From the library
              </h2>
              <p className="u-muted u-fs-14 u-m-0" style={{ maxWidth: 400 }}>
                Digital loan → read in browser → access locks when time ends. Deposit refunded on return.
              </p>
            </div>
            <Link to="/library" className="btn btn-primary">
              Browse library <ArrowRight size={16} />
            </Link>
          </div>
          <div className={styles.bookGrid} style={{ marginTop: 20 }}>
            {libraryRail.map((b, i) => (
              <BookCard key={b.id} book={b} variant="library" className={`delay-${Math.min(i, 9)}`} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
