import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { BookCard } from '../shared/BookCard.jsx';
import { EmptyState } from '../shared/EmptyState.jsx';
import { useAppSelector } from '../../library/storeHooks.js';
import { GENRES } from '../../library/json/booksData.js';
<<<<<<< HEAD

export function CataloguePage({ mode: forcedMode }) {
  const books = useAppSelector((s) => s.books.items);
=======
import styles from '../../styles/components/page/ShopPage.module.css';
import { cn } from '../../library/helpers/cn.js';

export function CataloguePage({ mode: forcedMode }) {
  const books = useAppSelector((s) => s.books.items) || [];
>>>>>>> fd34775763874bd90ed505782f080973551b04de
  const globalMode = useAppSelector((s) => s.books.mode);
  const mode = forcedMode || globalMode;

  const [genres, setGenres] = useState([]);
  const [priceMax, setPriceMax] = useState(2000);
  const [sort, setSort] = useState('rating');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const filtered = useMemo(() => {
    let list = books.filter((b) => (mode === 'library' ? b.forLoan : b.forSale));
    if (genres.length) list = list.filter((b) => genres.includes(b.genre));
    if (mode === 'shop') list = list.filter((b) => b.price <= priceMax);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'newest') list = [...list].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    if (sort === 'title') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [books, mode, genres, priceMax, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleGenre = (g) => {
    setPage(1);
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const clearAll = () => {
    setGenres([]);
    setPriceMax(2000);
    setPage(1);
  };

  return (
<<<<<<< HEAD
    <div className="container page-enter" style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,260px) 1fr', gap: 36, padding: '36px 0 56px', alignItems: 'start' }}>
      <aside
        className="card hide-mobile"
        style={{
          padding: 22,
          position: 'sticky',
          top: 'calc(var(--nav-h) + 16px)',
          background: 'linear-gradient(165deg, var(--card) 0%, var(--well) 160%)',
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', margin: '0 0 14px' }}>
          Genre
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {GENRES.map((g) => {
            const count = books.filter((b) => b.genre === g && (mode === 'library' ? b.forLoan : b.forSale)).length;
            return (
              <label key={g} style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>
                <input type="checkbox" checked={genres.includes(g)} onChange={() => toggleGenre(g)} style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                <span style={{ flex: 1 }}>{g}</span>
                <span style={{ color: 'var(--muted)', fontSize: 12 }}>{count}</span>
              </label>
            );
          })}
        </div>
        {mode === 'shop' && (
          <div style={{ marginBottom: 20, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>Price range</h3>
            <p style={{ fontWeight: 800, color: 'var(--primary)', margin: '8px 0' }}>KES 0 – {priceMax.toLocaleString()}</p>
            <input type="range" min={500} max={2000} step={50} value={priceMax} onChange={(e) => { setPriceMax(Number(e.target.value)); setPage(1); }} style={{ width: '100%', accentColor: 'var(--primary)' }} />
          </div>
        )}
        {mode === 'library' && (
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.45 }}>
            Deposits are held and refunded when you return the book in good condition. Usually reviewed within a few hours.
          </p>
        )}
        <button type="button" className="btn btn-ghost btn-sm" onClick={clearAll}>Clear filters</button>
      </aside>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '1.05rem' }}>
            <strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> books {mode === 'library' ? 'to borrow' : 'for sale'}
          </p>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input" style={{ width: 'auto', padding: '10px 14px' }}>
            <option value="rating">Top rated</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="title">Title</option>
          </select>
        </div>

        {(genres.length > 0 || (mode === 'shop' && priceMax < 2000)) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {genres.map((g) => (
              <button key={g} type="button" className="chip chip-primary chip-dismiss" onClick={() => toggleGenre(g)}>
                {g} <X size={12} />
              </button>
            ))}
            {mode === 'shop' && priceMax < 2000 && (
              <button type="button" className="chip chip-primary chip-dismiss" onClick={() => setPriceMax(2000)}>
                Under KES {priceMax.toLocaleString()} <X size={12} />
              </button>
            )}
            <button type="button" className="link-orange" style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 13 }} onClick={clearAll}>
              Clear all
            </button>
          </div>
        )}

        {/* Mobile genre chips */}
        <div className="hide-desktop" style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, paddingBottom: 4 }}>
=======
    <div className={`container page-enter ${styles.layout}`}>
      <aside className={`card hide-mobile ${styles.aside}`}>
        <h3 className={styles.asideTitle}>Filters</h3>
        <div className={styles.genreList}>
>>>>>>> fd34775763874bd90ed505782f080973551b04de
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
<<<<<<< HEAD
              className={`chip ${genres.includes(g) ? 'chip-primary' : ''}`}
              style={{ border: 'none', cursor: 'pointer', flexShrink: 0 }}
=======
              className={cn(styles.genreBtn, genres.includes(g) && styles.genreBtnOn)}
>>>>>>> fd34775763874bd90ed505782f080973551b04de
              onClick={() => toggleGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>
<<<<<<< HEAD
=======
        {mode === 'shop' && (
          <>
            <label className={styles.priceLabel} htmlFor="priceMax">Max price · KES {priceMax.toLocaleString()}</label>
            <input
              id="priceMax"
              type="range"
              min={200}
              max={3000}
              step={50}
              value={priceMax}
              className="u-w-full"
              onChange={(e) => { setPriceMax(Number(e.target.value)); setPage(1); }}
            />
          </>
        )}
        <button type="button" className="btn btn-ghost btn-sm u-w-full" onClick={clearAll}>Clear filters</button>
      </aside>

      <div>
        <div className={styles.headRow}>
          <div>
            <h1 className="serif">{mode === 'library' ? 'Library' : 'Shop'}</h1>
            <p className="u-muted u-fs-14 u-m-0">
              <strong className="u-ink">{filtered.length}</strong> books {mode === 'library' ? 'to borrow' : 'for sale'}
            </p>
          </div>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="input"
            aria-label="Sort"
          >
            <option value="rating">Top rated</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price · low to high</option>
            <option value="price-desc">Price · high to low</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>

        {(genres.length > 0 || (mode === 'shop' && priceMax < 2000)) && (
          <div className={styles.activeFilters}>
            {genres.map((g) => (
              <button key={g} type="button" className="filter-chip on" onClick={() => toggleGenre(g)}>
                {g} <X size={12} />
              </button>
            ))}
            {mode === 'shop' && priceMax < 2000 && (
              <button type="button" className="filter-chip on" onClick={() => setPriceMax(2000)}>
                ≤ KES {priceMax.toLocaleString()} <X size={12} />
              </button>
            )}
            <button type="button" className="link-orange" onClick={clearAll}>Clear all</button>
          </div>
        )}

        <div className={styles.mobileGenres}>
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              className={cn('chip', genres.includes(g) && 'chip-primary')}
              onClick={() => toggleGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>

        <p className="meta u-fs-14 u-muted">
          Showing <strong className="u-ink">{pageItems.length}</strong> of <strong className="u-ink">{filtered.length}</strong>
        </p>
>>>>>>> fd34775763874bd90ed505782f080973551b04de

        {pageItems.length === 0 ? (
          <EmptyState
            title="No books match"
            description="Try clearing filters or searching for a different genre."
            action={<button type="button" className="btn btn-outline" onClick={clearAll}>Clear filters</button>}
          />
        ) : (
          <div className="book-grid">
            {pageItems.map((b, i) => (
              <BookCard
                key={b.id}
                book={b}
                variant={mode === 'library' ? 'library' : 'shop'}
<<<<<<< HEAD
                style={{ animationDelay: `${i * 40}ms` }}
=======
                className={`delay-${Math.min(i, 9)}`}
>>>>>>> fd34775763874bd90ed505782f080973551b04de
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
<<<<<<< HEAD
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
=======
          <div className={styles.pager}>
>>>>>>> fd34775763874bd90ed505782f080973551b04de
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
<<<<<<< HEAD
                onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  border: '1px solid var(--line)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: n === page ? 'var(--primary)' : 'var(--card)',
                  color: n === page ? '#fff' : 'var(--ink)',
                }}
=======
                className={cn(styles.pageBtn, n === page && styles.pageBtnOn)}
                onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
>>>>>>> fd34775763874bd90ed505782f080973551b04de
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ShopPage() {
  return <CataloguePage mode="shop" />;
}
