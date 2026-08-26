import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, BookOpen, Lock, X } from 'lucide-react';
import { useAppSelector } from '../../library/storeHooks.js';
import { resolveBookAccess } from '../../library/helpers/readerAccess.js';
import { getChapters } from '../../library/json/chapterContent.js';
import { load, save } from '../../library/helpers/storage.js';
import styles from '../../styles/components/page/ReaderPage.module.css';

const THEMES = {
  paper: { bg: '#f7f4f1', ink: '#1c1917', muted: '#78716c' },
  sepia: { bg: '#f4ecd8', ink: '#5c4b37', muted: '#8a7355' },
  night: { bg: '#121110', ink: '#e7e5e4', muted: '#a8a29e' },
};

export function ReaderPage() {
  const { bookId } = useParams();
  const [params] = useSearchParams();
  const books = useAppSelector((s) => s.books.items);
  const user = useAppSelector((s) => s.auth.user);
  const purchases = useAppSelector((s) => s.orders.purchases);
  const loans = useAppSelector((s) => s.orders.loans);
  const navigate = useNavigate();

  const book = books.find((b) => b.id === bookId);
  const access = useMemo(
    () => resolveBookAccess(bookId, { user, purchases, loans }),
    [bookId, user, purchases, loans]
  );

  const chapters = useMemo(() => getChapters(book), [book]);
  const progressKey = `bk-read-${user?.id || 'g'}-${bookId}`;
  const saved = load(progressKey, { chapter: 0, theme: 'paper', font: 18 });

  const [chapter, setChapter] = useState(saved.chapter || 0);
  const [theme, setTheme] = useState(saved.theme || 'paper');
  const [font, setFont] = useState(saved.font || 18);

  useEffect(() => {
    save(progressKey, { chapter, theme, font });
  }, [chapter, theme, font, progressKey]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapter]);

  if (!user) {
    return (
      <div className="container empty-state">
        <Lock size={32} />
        <h1 className="serif">Sign in to read</h1>
        <Link to="/login" className="btn btn-primary">Sign in</Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container empty-state">
        <h1 className="serif">Book not found</h1>
        <Link to="/shelf" className="btn btn-primary">My Shelf</Link>
      </div>
    );
  }

  if (!access.canRead) {
    return (
      <div className="container empty-state page-enter">
        <div className="empty-icon"><Lock size={28} /></div>
        <h3>Digital access locked</h3>
        <p>{access.label}</p>
        {access.reason === 'expired' && (
          <p style={{ color: 'var(--muted)' }}>Borrow again from the library when a copy is available.</p>
        )}
        {access.reason === 'deposit' && (
          <Link to="/shelf?tab=borrowing" className="btn btn-primary">Pay deposit on Shelf</Link>
        )}
        {access.reason === 'none' && (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={`/book/${bookId}`} className="btn btn-primary">Buy or borrow</Link>
            <Link to="/library" className="btn btn-ghost">Library</Link>
          </div>
        )}
        <div style={{ marginTop: 16 }}>
          <Link to="/shelf" className="link-orange">← Back to Shelf</Link>
        </div>
      </div>
    );
  }

  const t = THEMES[theme] || THEMES.paper;
  const current = chapters[Math.min(chapter, chapters.length - 1)];
  const pct = Math.round(((chapter + 1) / chapters.length) * 100);

  return (
    <div className={styles.shell} style={{ background: t.bg, color: t.ink }}>
      <header className={styles.top}>
        <button type="button" className={styles.iconBtn} onClick={() => navigate(params.get('from') || '/shelf')} aria-label="Close reader">
          <X size={20} />
        </button>
        <div className={styles.topMeta}>
          <strong style={{ color: t.ink }}>{book.title}</strong>
          <span style={{ color: t.muted }}>{access.label}</span>
        </div>
        <div className={styles.tools}>
          <button type="button" className={styles.iconBtn} onClick={() => setFont((f) => Math.max(14, f - 2))} aria-label="Smaller text"><Minus size={16} /></button>
          <button type="button" className={styles.iconBtn} onClick={() => setFont((f) => Math.min(28, f + 2))} aria-label="Larger text"><Plus size={16} /></button>
          {Object.keys(THEMES).map((key) => (
            <button
              key={key}
              type="button"
              title={key}
              onClick={() => setTheme(key)}
              className={styles.themeDot}
              style={{
                background: THEMES[key].bg,
                borderColor: theme === key ? 'var(--primary)' : t.muted,
                boxShadow: theme === key ? '0 0 0 2px var(--primary)' : 'none',
              }}
            />
          ))}
        </div>
      </header>

      {access.mode === 'borrowed' && access.daysLeft != null && (
        <div className={styles.loanBanner}>
          <BookOpen size={14} />
          Digital loan · {access.daysLeft} day{access.daysLeft === 1 ? '' : 's'} remaining
          {access.dueAt && ` · ends ${new Date(access.dueAt).toLocaleDateString()}`}
        </div>
      )}
      {access.mode === 'owned' && (
        <div className={styles.ownBanner}>You own this title · read anytime</div>
      )}

      <article className={styles.page} style={{ fontSize: font }}>
        <p className={styles.chapterLabel} style={{ color: t.muted }}>{current.title}</p>
        <div className={styles.body}>
          {current.body.split('\n').map((line, i) =>
            line.trim() === '' ? <br key={i} /> : <p key={i}>{line}</p>
          )}
        </div>
      </article>

      <footer className={styles.bottom}>
        <button
          type="button"
          className={styles.navBtn}
          disabled={chapter <= 0}
          onClick={() => setChapter((c) => Math.max(0, c - 1))}
        >
          <ChevronLeft size={18} /> Prev
        </button>
        <div className={styles.progress}>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${pct}%` }} />
          </div>
          <span style={{ color: t.muted }}>{chapter + 1} / {chapters.length}</span>
        </div>
        <button
          type="button"
          className={styles.navBtn}
          disabled={chapter >= chapters.length - 1}
          onClick={() => setChapter((c) => Math.min(chapters.length - 1, c + 1))}
        >
          Next <ChevronRight size={18} />
        </button>
      </footer>
    </div>
  );
}
