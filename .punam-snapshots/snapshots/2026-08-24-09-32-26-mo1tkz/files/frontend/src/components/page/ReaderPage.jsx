import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, BookOpen, Lock, X } from 'lucide-react';
import { useAppSelector } from '../../library/storeHooks.js';
import { resolveBookAccess } from '../../library/helpers/readerAccess.js';
import { getChapters } from '../../library/json/chapterContent.js';
import { load, save } from '../../library/helpers/storage.js';

const THEMES = {
  paper: { bg: '#f7f4f1', ink: '#1c1917', muted: '#78716c' },
  sepia: { bg: '#f4ecd8', ink: '#5c4b37', muted: '#8a7355' },
  night: { bg: '#121110', ink: '#e7e5e4', muted: '#a8a29e' },
};

const toolBtn = {
  width: 32, height: 32, borderRadius: 8, border: '1px solid var(--line)',
  background: 'var(--card)', cursor: 'pointer', display: 'grid', placeItems: 'center',
};
const navBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '10px 14px',
  borderRadius: 999, border: '1px solid var(--line)', background: 'var(--card)',
  fontWeight: 700, cursor: 'pointer', color: 'var(--ink)',
};

export function ReaderPage() {
  const { bookId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const books = useAppSelector((s) => s.books.items) || [];
  const user = useAppSelector((s) => s.auth.user);
  const purchases = useAppSelector((s) => s.orders.purchases) || [];
  const loans = useAppSelector((s) => s.orders.loans) || [];

  const book = books.find((b) => b.id === bookId);
  const access = useMemo(
    () => resolveBookAccess(bookId, { user, purchases, loans }),
    [bookId, user, purchases, loans]
  );
  const chapters = useMemo(() => getChapters(book), [book]);
  const progressKey = `bk-read-${user?.id || 'g'}-${bookId}`;
  const saved = load(progressKey, { chapter: 0, theme: 'paper', font: 18 });

  const [chapter, setChapter] = useState(Number(saved.chapter) || 0);
  const [theme, setTheme] = useState(saved.theme || 'paper');
  const [font, setFont] = useState(Number(saved.font) || 18);

  useEffect(() => { save(progressKey, { chapter, theme, font }); }, [chapter, theme, font, progressKey]);
  useEffect(() => { window.scrollTo(0, 0); }, [chapter]);

  if (!user) {
    return (
      <div className="container empty-state" style={{ padding: 48, textAlign: 'center' }}>
        <Lock size={28} style={{ margin: '0 auto 12px' }} />
        <h1 className="serif">Sign in to read</h1>
        <Link to="/login" className="btn btn-primary">Sign in</Link>
      </div>
    );
  }
  if (!book) {
    return (
      <div className="container empty-state" style={{ padding: 48, textAlign: 'center' }}>
        <h1 className="serif">Book not found</h1>
        <Link to="/shelf" className="btn btn-primary">My Shelf</Link>
      </div>
    );
  }
  if (!access.canRead) {
    return (
      <div className="container empty-state" style={{ padding: 48, textAlign: 'center' }}>
        <Lock size={28} style={{ margin: '0 auto 12px', color: 'var(--muted)' }} />
        <h2 className="serif">Digital access locked</h2>
        <p style={{ color: 'var(--muted)' }}>{access.label}</p>
        {access.reason === 'expired' && (
          <p style={{ color: 'var(--muted)' }}>Borrow again from the library when a copy is free.</p>
        )}
        {String(access.label || '').includes('deposit') && (
          <Link to="/shelf?tab=borrowing" className="btn btn-primary">Pay deposit on Shelf</Link>
        )}
        {String(access.label || '').includes('Buy') && (
          <Link to={`/book/${bookId}`} className="btn btn-primary">Buy or borrow</Link>
        )}
        <div style={{ marginTop: 16 }}>
          <Link to="/shelf" className="link-orange">← Back to Shelf</Link>
        </div>
      </div>
    );
  }

  const t = THEMES[theme] || THEMES.paper;
  const idx = Math.min(Math.max(0, chapter), chapters.length - 1);
  const current = chapters[idx];
  const pct = Math.round(((idx + 1) / chapters.length) * 100);

  return (
    <div style={{ minHeight: '100vh', background: t.bg, color: t.ink, display: 'flex', flexDirection: 'column' }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 20, display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', background: 'color-mix(in srgb, var(--card) 92%, transparent)',
        backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line)',
      }}>
        <button type="button" onClick={() => navigate(params.get('from') || '/shelf')} aria-label="Close" style={toolBtn}>
          <X size={18} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <strong style={{ display: 'block', fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</strong>
          <span style={{ fontSize: 12, color: t.muted }}>{access.label}</span>
        </div>
        <button type="button" onClick={() => setFont((f) => Math.max(14, f - 2))} style={toolBtn}><Minus size={14} /></button>
        <button type="button" onClick={() => setFont((f) => Math.min(28, f + 2))} style={toolBtn}><Plus size={14} /></button>
        {Object.keys(THEMES).map((key) => (
          <button
            key={key}
            type="button"
            title={key}
            onClick={() => setTheme(key)}
            style={{
              width: 20, height: 20, borderRadius: '50%', cursor: 'pointer', padding: 0,
              border: theme === key ? '2px solid var(--primary)' : '1px solid var(--line)',
              background: THEMES[key].bg,
            }}
          />
        ))}
      </header>

      {access.mode === 'borrowed' && (
        <div style={{
          textAlign: 'center', padding: '8px 16px', fontSize: 13, fontWeight: 700,
          background: 'var(--warning-soft)', color: 'var(--warning)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <BookOpen size={14} />
          Digital loan{access.daysLeft != null ? ` · ${access.daysLeft} day${access.daysLeft === 1 ? '' : 's'} left` : ''}
          {access.dueAt ? ` · ends ${new Date(access.dueAt).toLocaleDateString()}` : ''}
        </div>
      )}
      {access.mode === 'owned' && (
        <div style={{ textAlign: 'center', padding: '8px 16px', fontSize: 13, fontWeight: 700, background: 'var(--success-soft)', color: 'var(--success)' }}>
          You own this title · read anytime
        </div>
      )}

      <article style={{ flex: 1, width: 'min(680px, calc(100% - 40px))', margin: '32px auto 100px', fontSize: font, lineHeight: 1.75 }}>
        <p style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.muted, marginBottom: 20 }}>
          {current.title}
        </p>
        {current.body.split('\n').map((line, i) =>
          line.trim() === '' ? <br key={i} /> : (
            <p key={i} style={{ margin: '0 0 1.1em', fontFamily: 'var(--font-serif)', fontWeight: 500 }}>{line}</p>
          )
        )}
      </article>

      <footer style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', background: 'color-mix(in srgb, var(--card) 94%, transparent)',
        backdropFilter: 'blur(14px)', borderTop: '1px solid var(--line)',
      }}>
        <button type="button" disabled={idx <= 0} onClick={() => setChapter(idx - 1)} style={navBtn}>
          <ChevronLeft size={16} /> Prev
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: 600, color: t.muted }}>
          <div style={{ height: 4, maxWidth: 140, margin: '0 auto 4px', borderRadius: 99, background: 'var(--line)', overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary)', borderRadius: 99 }} />
          </div>
          {idx + 1} / {chapters.length}
        </div>
        <button type="button" disabled={idx >= chapters.length - 1} onClick={() => setChapter(idx + 1)} style={navBtn}>
          Next <ChevronRight size={16} />
        </button>
      </footer>
    </div>
  );
}
