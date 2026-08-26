/**
 * Digital access rules (online library model):
 * - Paid purchase  → own forever (online + offline when API supports)
 * - Active loan    → access until dueAt; then file locks
 * - return_requested → still readable until admin marks returned
 * - pending / approved (deposit unpaid) / rejected → no reader access
 */

export function getPurchaseAccess(order) {
  if (!order) return { canRead: false, reason: 'not_found' };
  if (order.status === 'paid') {
    return { canRead: true, mode: 'owned', label: 'You own this book' };
  }
  return { canRead: false, reason: order.status, label: 'Purchase not completed' };
}

export function getLoanAccess(loan) {
  if (!loan) return { canRead: false, reason: 'not_found' };
  if (loan.status === 'rejected') {
    return { canRead: false, reason: 'rejected', label: 'Loan was rejected' };
  }
  if (loan.status === 'returned') {
    return { canRead: false, reason: 'returned', label: 'Loan ended — return confirmed' };
  }
  if (loan.status === 'pending') {
    return { canRead: false, reason: 'pending', label: 'Awaiting approval' };
  }
  if (loan.status === 'approved') {
    return { canRead: false, reason: 'deposit', label: 'Pay deposit to unlock reading' };
  }
  if (loan.status === 'active' || loan.status === 'return_requested') {
    const due = loan.dueAt ? Number(loan.dueAt) : null;
    if (due && Date.now() > due) {
      return {
        canRead: false,
        reason: 'expired',
        label: 'Loan expired — digital access locked',
        dueAt: due,
      };
    }
    const daysLeft = due ? Math.max(0, Math.ceil((due - Date.now()) / 86400000)) : null;
    return {
      canRead: true,
      mode: 'borrowed',
      label: daysLeft != null ? `Borrowed · ${daysLeft} day${daysLeft === 1 ? '' : 's'} left` : 'Borrowed',
      dueAt: due,
      daysLeft,
    };
  }
  return { canRead: false, reason: 'unknown', label: 'No access' };
}

/** Resolve best access for a book id for the current user */
export function resolveBookAccess(bookId, { user, purchases, loans }) {
  if (!user) return { canRead: false, reason: 'auth', label: 'Sign in to read' };

  const paid = purchases.find(
    (o) => o.userId === user.id && o.status === 'paid' && o.items?.some((i) => i.bookId === bookId)
  );
  if (paid) {
    return { ...getPurchaseAccess(paid), source: 'purchase', refId: paid.id, bookId };
  }

  const loan = loans
    .filter((l) => l.userId === user.id && l.bookId === bookId)
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0];

  if (loan) {
    return { ...getLoanAccess(loan), source: 'loan', refId: loan.id, bookId };
  }

  return { canRead: false, reason: 'none', label: 'Buy or borrow to read online' };
}
