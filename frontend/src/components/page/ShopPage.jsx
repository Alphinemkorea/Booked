import { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { BookCard } from '../shared/BookCard.jsx';
import { EmptyState } from '../shared/EmptyState.jsx';
import { useAppSelector } from '../../library/storeHooks.js';
import { GENRES } from '../../library/json/booksData.js';
import styles from '../../styles/components/page/ShopPage.module.css';
import { cn } from '../../library/helpers/cn.js';

export function CataloguePage({ mode: forcedMode }) {
  const books = useAppSelector((s) => s.books.items) || [];
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
    <div className={`container page-enter ${styles.layout}`}>
      <aside className={`card hide-mobile ${styles.aside}`}>
        <h3 className={styles.asideTitle}>Filters</h3>
        <div className={styles.genreList}>
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              className={cn(styles.genreBtn, genres.includes(g) && styles.genreBtnOn)}
              onClick={() => toggleGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>
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
                className={`delay-${Math.min(i, 9)}`}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.pager}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={cn(styles.pageBtn, n === page && styles.pageBtnOn)}
                onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
