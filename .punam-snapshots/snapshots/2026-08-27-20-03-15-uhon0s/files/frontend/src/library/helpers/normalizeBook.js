/**
 * Map backend book documents to the shape the UI expects.
 * Tolerates common field names from Express/Mongo/Prisma APIs.
 */
export function normalizeBook(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const id = String(raw.id || raw._id || raw.bookId || '');
  if (!id) return null;

  const price = Number(raw.price ?? raw.salePrice ?? 0);
  const deposit = Number(raw.deposit ?? raw.loanDeposit ?? Math.round(price * 0.25) ?? 0);
  const forSale = raw.forSale ?? raw.availableForSale ?? raw.isForSale ?? true;
  const forLoan = raw.forLoan ?? raw.availableForLoan ?? raw.isForLoan ?? true;

  return {
    id,
    title: raw.title || 'Untitled',
    author: raw.author || raw.authorName || 'Unknown',
    genre: raw.genre || raw.category || 'Fiction',
    price,
    stock: Number(raw.stock ?? raw.quantity ?? raw.copies ?? 0),
    rating: Number(raw.rating ?? raw.avgRating ?? 0),
    reviews: Number(raw.reviews ?? raw.reviewCount ?? 0),
    forSale: Boolean(forSale),
    forLoan: Boolean(forLoan),
    deposit,
    loanDays: Number(raw.loanDays ?? raw.loanDuration ?? raw.durationDays ?? 14),
    pages: Number(raw.pages ?? 0),
    isbn: raw.isbn || '',
    cover:
      raw.cover ||
      raw.coverUrl ||
      raw.image ||
      raw.imageUrl ||
      raw.thumbnail ||
      '',
    blurb: raw.blurb || raw.description || raw.summary || '',
    uploadedAt: raw.uploadedAt || raw.createdAt || raw.publishedAt || null,
    featured: Boolean(raw.featured ?? raw.isFeatured ?? false),
  };
}

export function normalizeBooks(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload?.books || payload?.data || payload?.items || payload?.results || [];
  return list.map(normalizeBook).filter(Boolean);
}
