import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { setPurchaseStatus, setLoanStatus } from '../../library/slices/ordersSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { toggleWish } from '../../library/slices/wishlistSlice.js';
import { formatKES } from '../../library/json/booksData.js';
import { StatusChip } from '../shared/StatusChip.jsx';
import { EmptyState } from '../shared/EmptyState.jsx';
import { MpesaPaymentModal } from '../shared/MpesaPaymentModal.jsx';
import { BookCard } from '../shared/BookCard.jsx';
import { getLoanAccess, getPurchaseAccess } from '../../library/helpers/readerAccess.js';
import { BookOpen } from 'lucide-react';

/**
 * BUY flow:  pending → approved → [M-Pesa pay] → paid
 * BORROW:    pending → approved → [M-Pesa deposit] → active → return_requested → returned
 */
export function ShelfPage() {
  const user = useAppSelector((s) => s.auth.user);
  const purchases = useAppSelector((s) => s.orders.purchases);
  const loans = useAppSelector((s) => s.orders.loans);
  const wishIds = useAppSelector((s) => s.wishlist.ids);
  const books = useAppSelector((s) => s.books.items);
  const dispatch = useAppDispatch();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'purchases';

  const [payTarget, setPayTarget] = useState(null); // { kind: 'purchase'|'loan', id }

  const myOrders = useMemo(() => purchases.filter((o) => user && o.userId === user.id), [purchases, user]);
  const myLoans = useMemo(() => loans.filter((l) => user && l.userId === user.id), [loans, user]);
  const wishBooks = useMemo(() => books.filter((b) => wishIds.includes(b.id)), [books, wishIds]);

  if (!user) {
    return (
      <div className="container empty-state page-enter">
        <h1 className="serif">My Shelf</h1>
        <p>Sign in to track purchases, loans, and wishlist.</p>
        <Link to="/login" className="btn btn-primary">Sign in</Link>
      </div>
    );
  }

  const payingOrder = payTarget?.kind === 'purchase' ? myOrders.find((o) => o.id === payTarget.id) : null;
  const payingLoan = payTarget?.kind === 'loan' ? myLoans.find((l) => l.id === payTarget.id) : null;
  const payAmount = payingOrder?.total ?? payingLoan?.deposit ?? 0;

  const onPaySuccess = ({ receipt, msisdn }) => {
    if (payingOrder) {
      dispatch(setPurchaseStatus({
        id: payingOrder.id,
        status: 'paid',
        patch: { paidAt: new Date().toISOString(), receipt, msisdn },
      }));
      dispatch(pushToast({ message: `Order paid · Receipt ${receipt}` }));
    }
    if (payingLoan) {
      dispatch(setLoanStatus({
        id: payingLoan.id,
        status: 'active',
        patch: {
          paidAt: new Date().toISOString(),
          receipt,
          msisdn,
          dueAt: Date.now() + (payingLoan.duration || 14) * 86400000,
        },
      }));
      dispatch(pushToast({ message: `Deposit paid · Loan is now active · Receipt ${receipt}` }));
    }
    setPayTarget(null);
  };

  const tabs = [
    { id: 'purchases', label: 'Purchases' },
    { id: 'borrowing', label: 'Borrowing' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'history', label: 'History' },
  ];

  return (
    <div className="container page-enter" style={{ padding: '36px 0 56px', minHeight: '50vh' }}>
      <h1 className="serif" style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: 8 }}>My Shelf</h1>
      <p style={{ textAlign: 'center', color: 'var(--muted)', marginTop: 0, marginBottom: 28 }}>
        Orders, loans, and books you saved
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 36, borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setParams({ tab: t.id })}
            style={{
              border: 'none',
              background: 'none',
              padding: '14px 18px',
              fontWeight: 700,
              cursor: 'pointer',
              color: tab === t.id ? 'var(--primary)' : 'var(--muted)',
              borderBottom: tab === t.id ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: -1,
              fontSize: 15,
            }}
          >
            {t.label}
            {t.id === 'wishlist' && wishIds.length > 0 && (
              <span className="chip chip-primary" style={{ marginLeft: 8 }}>{wishIds.length}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tab === 'purchases' && (
          myOrders.filter((o) => o.status !== 'paid' && o.status !== 'rejected').length === 0 ? (
            <EmptyState
              title="No open purchases"
              description="Buy from the shop. After admin approves, you pay with M-Pesa here."
              action={<Link to="/shop" className="btn btn-outline">Browse Shop</Link>}
            />
          ) : (
            myOrders
              .filter((o) => o.status !== 'paid' && o.status !== 'rejected')
              .map((o) => (
                <article key={o.id} className="card" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10, alignItems: 'center' }}>
                    <span className="chip">#{o.id}</span>
                    <StatusChip status={o.status} />
                    <strong className="price" style={{ marginLeft: 'auto' }}>{formatKES(o.total)}</strong>
                  </div>
                  <ul style={{ color: 'var(--muted)', margin: '0 0 12px' }}>
                    {o.items.map((i, idx) => (
                      <li key={idx}>{i.title} × {i.qty}</li>
                    ))}
                  </ul>
                  {o.status === 'pending' && (
                    <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
                      Awaiting admin approval. You will pay with M-Pesa once approved (usually within a few hours).
                    </p>
                  )}
                  {o.status === 'approved' && (
                    <button type="button" className="btn btn-primary" onClick={() => setPayTarget({ kind: 'purchase', id: o.id })}>
                      Pay {formatKES(o.total)} with M-Pesa
                    </button>
                  )}
                </article>
              ))
          )
        )}


        {tab === 'purchases' && myOrders.filter((o) => o.status === 'paid').length > 0 && (
          <div style={{ marginTop: 28 }}>
            <h3 className="serif" style={{ fontSize: '1.25rem', marginBottom: 12 }}>Your digital library</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 14 }}>Books you own — open anytime in the browser. Nothing is shipped.</p>
            {myOrders.filter((o) => o.status === 'paid').map((o) => (
              <article key={`own-${o.id}`} className="card" style={{ padding: 16, marginBottom: 10, display: 'flex', gap: 14, alignItems: 'center' }}>
                {o.items[0]?.cover && <img src={o.items[0].cover} alt="" style={{ width: 48, height: 68, objectFit: 'cover', borderRadius: 6 }} />}
                <div style={{ flex: 1 }}>
                  <strong>{o.items.map((i) => i.title).join(', ')}</strong>
                  <div style={{ marginTop: 6 }}><span className="chip chip-success">Owned forever</span></div>
                </div>
                {o.items[0] && (
                  <Link to={`/read/${o.items[0].bookId}?from=/shelf?tab=purchases`} className="btn btn-primary btn-sm">Read</Link>
                )}
              </article>
            ))}
          </div>
        )}

        {tab === 'borrowing' && (
          myLoans.filter((l) => ['pending', 'approved', 'active', 'return_requested'].includes(l.status)).length === 0 ? (
            <EmptyState
              title="No open loans"
              description="Request a book from the library. After approval, pay the deposit to start your loan."
              action={<Link to="/library" className="btn btn-outline">Browse Library</Link>}
            />
          ) : (
            myLoans
              .filter((l) => ['pending', 'approved', 'active', 'return_requested'].includes(l.status))
              .map((l) => {
                const days = l.dueAt ? Math.ceil((l.dueAt - Date.now()) / 86400000) : null;
                return (
                  <article key={l.id} className="card" style={{ padding: 18, display: 'flex', gap: 14 }}>
                    {l.cover && <img src={l.cover} alt="" style={{ width: 56, height: 80, objectFit: 'cover', borderRadius: 6 }} />}
                    <div style={{ flex: 1 }}>
                      <strong>{l.title}</strong>
                      <p style={{ color: 'var(--muted)', fontSize: 14, margin: '2px 0 8px' }}>{l.author}</p>
                      <StatusChip status={l.status} loan />
                      {l.duration && <span className="chip" style={{ marginLeft: 6 }}>{l.duration} days</span>}
                      {days != null && (
                        <span className={`chip ${days <= 3 ? 'chip-warning' : 'chip-info'}`} style={{ marginLeft: 6 }}>
                          {days < 0 ? 'Overdue' : `Due in ${days}d`}
                        </span>
                      )}
                      {l.status === 'pending' && (
                        <p style={{ color: 'var(--muted)', fontSize: 14, margin: '10px 0 0' }}>
                          Waiting for admin approval. Deposit ({formatKES(l.deposit)}) is paid only after approval.
                        </p>
                      )}
                      {l.status === 'approved' && (
                        <div style={{ marginTop: 12 }}>
                          <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 10px' }}>
                            Approved! Pay the refundable deposit to activate your loan.
                          </p>
                          <button type="button" className="btn btn-primary" onClick={() => setPayTarget({ kind: 'loan', id: l.id })}>
                            Pay deposit {formatKES(l.deposit)} with M-Pesa
                          </button>
                        </div>
                      )}
                      {l.status === 'active' && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                          {getLoanAccess(l).canRead ? (
                            <Link to={`/read/${l.bookId}?from=/shelf?tab=borrowing`} className="btn btn-primary btn-sm">
                              <BookOpen size={14} /> Read now
                            </Link>
                          ) : (
                            <span className="chip chip-danger">{getLoanAccess(l).label}</span>
                          )}
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => {
                              dispatch(setLoanStatus({ id: l.id, status: 'return_requested' }));
                              dispatch(pushToast({ message: 'Return request submitted' }));
                            }}
                          >
                            Request return
                          </button>
                        </div>
                      )}
                      {l.status === 'return_requested' && (
                        <p style={{ color: 'var(--muted)', fontSize: 14, margin: '10px 0 0' }}>
                          Return in progress — deposit refunded after admin confirms.
                        </p>
                      )}
                    </div>
                  </article>
                );
              })
          )
        )}

        {tab === 'wishlist' && (
          wishBooks.length === 0 ? (
            <EmptyState
              icon={<Heart size={28} />}
              title="Wishlist is empty"
              description="Tap the heart on any book to save it here for later."
              action={<Link to="/shop" className="btn btn-outline">Discover books</Link>}
            />
          ) : (
            <div className="book-grid">
              {wishBooks.map((b, i) => (
                <BookCard key={b.id} book={b} style={{ animationDelay: `${i * 40}ms` }} />
              ))}
            </div>
          )
        )}

        {tab === 'history' && (
          <>
            {myOrders.filter((o) => o.status === 'paid' || o.status === 'rejected').map((o) => (
              <article key={o.id} className="card" style={{ padding: 18 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span>Purchase · {o.items[0]?.title}</span>
                  <StatusChip status={o.status} />
                  <strong className="price">{formatKES(o.total)}</strong>
                </div>
                {o.receipt && <p style={{ color: 'var(--muted)', fontSize: 14, margin: '8px 0 0' }}>M-Pesa receipt: {o.receipt}</p>}
                {o.status === 'paid' && o.items?.[0] && (
                  <Link to={`/read/${o.items[0].bookId}?from=/shelf?tab=history`} className="btn btn-primary btn-sm" style={{ marginTop: 10 }}>
                    Read online
                  </Link>
                )}
              </article>
            ))}
            {myLoans.filter((l) => l.status === 'returned' || l.status === 'rejected').map((l) => (
              <article key={l.id} className="card" style={{ padding: 18 }}>
                <span>Loan · {l.title}</span> <StatusChip status={l.status} loan />
                {l.receipt && <p style={{ color: 'var(--muted)', fontSize: 14 }}>Deposit receipt: {l.receipt}</p>}
              </article>
            ))}
            {myOrders.filter((o) => o.status === 'paid' || o.status === 'rejected').length +
              myLoans.filter((l) => l.status === 'returned' || l.status === 'rejected').length === 0 && (
              <EmptyState title="No history yet" description="Completed buys and returned loans will show here." />
            )}
          </>
        )}
      </div>

      <MpesaPaymentModal
        open={!!payTarget}
        onClose={() => setPayTarget(null)}
        amount={payAmount}
        title={payingLoan ? 'Pay loan deposit' : 'Pay for your order'}
        subtitle={
          payingLoan
            ? 'Refundable deposit held until you return the book in good condition.'
            : 'Your order was approved. Complete payment to confirm ownership.'
        }
        lineItems={
          payingOrder
            ? [
                ...payingOrder.items.map((i) => ({ label: `${i.title} ×${i.qty}`, amount: i.price * i.qty })),
              ]
            : payingLoan
              ? [
                  { label: payingLoan.title, amount: 0 },
                  { label: `Deposit (${payingLoan.duration || 14} days)`, amount: payingLoan.deposit },
                ]
              : []
        }
        accountRef={payTarget?.id || 'BOOOKED'}
        onSuccess={onPaySuccess}
      />
    </div>
  );
}
