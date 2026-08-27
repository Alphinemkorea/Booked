import { useMemo } from 'react';
import { useAppSelector } from '../storeHooks.js';

export function useBooks({ mode, genres = [], priceMax, sort = 'rating' } = {}) {
  const books = useAppSelector((s) => s.books.items) || [];
  const globalMode = useAppSelector((s) => s.books.mode);
  const effectiveMode = mode || globalMode;

  return useMemo(() => {
    let list = books.filter((b) => (effectiveMode === 'library' ? b.forLoan : b.forSale));
    if (genres.length) list = list.filter((b) => genres.includes(b.genre));
    if (effectiveMode === 'shop' && priceMax != null) list = list.filter((b) => b.price <= priceMax);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'newest') list = [...list].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    if (sort === 'title') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [books, effectiveMode, genres, priceMax, sort]);
}
