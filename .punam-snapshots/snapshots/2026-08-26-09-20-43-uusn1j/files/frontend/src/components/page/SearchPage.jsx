import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookCard } from '../shared/BookCard.jsx';
import { useAppSelector } from '../../library/storeHooks.js';

export function SearchPage() {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').trim().toLowerCase();
  const books = useAppSelector((s) => s.books.items);
  const mode = useAppSelector((s) => s.books.mode);
  const results = useMemo(() => {
    if (!q) return [];
    return books.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.genre.toLowerCase().includes(q));
  }, [books, q]);
  return (
    <div className="container" style={{ padding: '36px 0 56px' }}>
      <h1 className="serif" style={{ fontSize: '2rem' }}>Search</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 28 }}>{q ? <>Results for “{params.get('q')}” · {results.length} found</> : 'Type a query in the navbar.'}</p>
      <div className="book-grid">{results.map((b, i) => <BookCard key={b.id} book={b} variant={mode === 'library' ? 'library' : 'shop'} style={{ animationDelay: `${i * 40}ms` }} />)}</div>
    </div>
  );
}
