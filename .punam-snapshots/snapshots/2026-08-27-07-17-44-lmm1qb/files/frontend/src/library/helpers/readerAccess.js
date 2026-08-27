/** Digital library access rules */
export function getLoanAccess(loan) {
  if (!loan) return { canRead: false, label: 'Not found' };
  if (loan.status === 'rejected') return { canRead: false, label: 'Loan rejected' };
  if (loan.status === 'returned') return { canRead: false, label: 'Loan ended' };
  if (loan.status === 'pending') return { canRead: false, label: 'Awaiting approval' };
  if (loan.status === 'approved') return { canRead: false, label: 'Pay deposit to unlock reading' };
  if (loan.status === 'active' || loan.status === 'return_requested') {
    const due = loan.dueAt ? Number(loan.dueAt) : null;
    if (due && Date.now() > due) {
      return { canRead: false, label: 'Loan expired — digital access locked', reason: 'expired', dueAt: due };
    }
    const daysLeft = due != null ? Math.max(0, Math.ceil((due - Date.now()) / 86400000)) : null;
    return {
      canRead: true,
      mode: 'borrowed',
      label: daysLeft != null ? `Borrowed · ${daysLeft}d left` : 'Borrowed',
      dueAt: due,
      daysLeft,
    };
  }
  return { canRead: false, label: 'No access' };
}

export function resolveBookAccess(bookId, { user, purchases, loans }) {
  if (!user) return { canRead: false, label: 'Sign in to read' };
  const paid = (purchases || []).find(
    (o) => o.userId === user.id && o.status === 'paid' && (o.items || []).some((i) => i.bookId === bookId)
  );
  if (paid) return { canRead: true, mode: 'owned', label: 'You own this book', source: 'purchase', refId: paid.id };
  const loan = (loans || [])
    .filter((l) => l.userId === user.id && l.bookId === bookId)
    .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))[0];
  if (loan) return { ...getLoanAccess(loan), source: 'loan', refId: loan.id };
  return { canRead: false, label: 'Buy or borrow to read online' };
}
