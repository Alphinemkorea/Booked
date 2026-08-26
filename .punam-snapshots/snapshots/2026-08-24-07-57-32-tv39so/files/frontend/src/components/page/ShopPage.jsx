import { useMemo, useState } from 'react';
import { BookCard } from '../shared/BookCard.jsx';
import { useAppSelector } from '../../library/storeHooks.js';
import { GENRES } from '../../library/json/booksData.js';

export function CataloguePage({ mode: forced }) {
  const books = useAppSelector((s) => s.books.items);
  const global = useAppSelector((s) => s.books.mode);
  const mode = forced || global;
  const [genres, setGenres] = useState([]);
  const [priceMax, setPriceMax] = useState(2000);
  const [sort, setSort] = useState('rating');
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => {
    let list = books.filter((b) => (mode === 'library' ? b.forLoan : b.forSale));
    if (genres.length) list = list.filter((b) => genres.includes(b.genre));
    if (mode === 'shop') list = list.filter((b) => b.price <= priceMax);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'newest') list = [...list].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    return list;
  }, [books, mode, genres, priceMax, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  const items = filtered.slice((page - 1) * 12, page * 12);
  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 36, padding: '36px 0 56px' }}>
      <aside className="card" style={{ padding: 22, position: 'sticky', top: 'calc(var(--nav-h) + 16px)', alignSelf: 'start', background: 'linear-gradient(165deg, var(--card), var(--well))' }}>
        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)', margin: '0 0 14px' }}>Genre</h3>
        {GENRES.map((g) => (
          <label key={g} style={{ display: 'flex', gap: 10, marginBottom: 8, fontWeight: 600, cursor: 'pointer' }}>
            <input type="checkbox" checked={genres.includes(g)} onChange={() => { setPage(1); setGenres((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g]); }} style={{ accentColor: 'var(--primary)' }} />
            {g}
          </label>
        ))}
        {mode === 'shop' && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
            <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>Price range</h3>
            <p style={{ fontWeight: 800, color: 'var(--primary)' }}>KES 0 – {priceMax.toLocaleString()}</p>
            <input type="range" min={500} max={2000} step={50} value={priceMax} onChange={(e) => { setPriceMax(Number(e.target.value)); setPage(1); }} style={{ width: '100%', accentColor: 'var(--primary)' }} />
          </div>
        )}
        <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => { setGenres([]); setPriceMax(2000); setPage(1); }}>Clear filters</button>
      </aside>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <p style={{ margin: 0, color: 'var(--muted)' }}><strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> books {mode === 'library' ? 'to borrow' : 'for sale'}</p>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input" style={{ width: 'auto' }}>
            <option value="rating">Top rated</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </div>
        <div className="book-grid">
          {items.map((b, i) => <BookCard key={b.id} book={b} variant={mode === 'library' ? 'library' : 'shop'} style={{ animationDelay: `${i * 40}ms` }} />)}
        </div>
        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" onClick={() => setPage(n)} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid var(--line)', fontWeight: 700, cursor: 'pointer', background: n === page ? 'var(--primary)' : 'var(--card)', color: n === page ? '#fff' : 'var(--ink)' }}>{n}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export function ShopPage() { return <CataloguePage mode="shop" />; }
