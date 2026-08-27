import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useAppSelector } from '../../library/storeHooks.js';
import styles from '../../styles/components/layout/Navbar.module.css';

export function MasterSearch({ className }) {
  const books = useAppSelector((s) => s.books.items) || [];
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return books.slice(0, 6);
    return books
      .filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          b.author.toLowerCase().includes(term) ||
          b.genre.toLowerCase().includes(term)
      )
      .slice(0, 8);
  }, [q, books]);

  return (
    <div className={className || styles.searchWrap}>
      <Search size={16} className={styles.searchIcon} aria-hidden />
      <input
        className={`input ${styles.searchInput}`}
        placeholder="Search books, authors…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 180)}
        aria-label="Search books"
      />
      {open && results.length > 0 && (
        <div className={styles.suggest} role="listbox">
          {results.map((b) => (
            <Link key={b.id} to={`/book/${b.id}`} className={styles.suggestItem} onMouseDown={(e) => e.preventDefault()}>
              <img src={b.cover} alt="" className="thumb-cover-sm" />
              <span className="u-truncate">{b.title}</span>
            </Link>
          ))}
          <Link to={`/search?q=${encodeURIComponent(q)}`} className={styles.suggestItem} onMouseDown={(e) => e.preventDefault()}>
            View all results
          </Link>
        </div>
      )}
    </div>
  );
}
