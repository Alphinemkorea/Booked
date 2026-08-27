import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { setLoanStatus, setLoans } from '../../library/slices/ordersSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { formatKES } from '../../library/json/booksData.js';
import { HAS_API } from '../../library/config.js';
import { adminApi } from '../../app/api/private/adminApi.js';

export function AdminLending() {
  const loans = useAppSelector((s) => s.orders.loans) || [];
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!HAS_API) return undefined;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await adminApi.loans.list();
        if (!cancelled && res.ok) dispatch(setLoans(res.loans));
      } catch (e) {
        if (!cancelled) dispatch(pushToast({ message: e.message || 'Could not load loans', tone: 'error' }));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [dispatch]);

  const setStatus = async (id, status, patch = {}) => {
    try {
      if (HAS_API) await adminApi.loans.setStatus(id, status, patch);
      dispatch(setLoanStatus({ id, status, patch }));
      dispatch(pushToast({ message: `Loan ${status.replace('_', ' ')}`, tone: 'success' }));
    } catch (e) {
      dispatch(pushToast({ message: e.message || 'Update failed', tone: 'error' }));
    }
  };

  const pending = loans.filter((l) => l.status === 'pending');
  const awaitingPay = loans.filter((l) => l.status === 'approved');
  const active = loans.filter((l) => l.status === 'active');
  const returns = loans.filter((l) => l.status === 'return_requested');

  return (
    <div>
      <header className="u-flex u-justify-between u-items-center" style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem' }}>Lending</h1>
        {loading && <span className="u-muted u-fs-13">Syncing…</span>}
      </header>

      <h2 className="u-fs-15" style={{ marginBottom: 12 }}>Pending requests ({pending.length})</h2>
      <div className="u-flex-col u-gap-8" style={{ marginBottom: 28 }}>
        {pending.map((l) => (
          <article key={l.id} className="card" style={{ padding: 16 }}>
            <strong>{l.title}</strong>
            <span className="u-muted" style={{ marginLeft: 8 }}>{l.userName} · {formatKES(l.deposit)}</span>
            <div className="u-flex u-gap-8" style={{ marginTop: 10 }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => setStatus(l.id, 'approved')}>Approve</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStatus(l.id, 'rejected')}>Reject</button>
            </div>
          </article>
        ))}
        {pending.length === 0 && <p className="u-muted">No pending requests.</p>}
      </div>

      <h2 className="u-fs-15" style={{ marginBottom: 12 }}>Awaiting deposit ({awaitingPay.length})</h2>
      <div className="u-flex-col u-gap-8" style={{ marginBottom: 28 }}>
        {awaitingPay.map((l) => (
          <article key={l.id} className="card" style={{ padding: 16 }}>
            <strong>{l.title}</strong>
            <span className="u-muted" style={{ marginLeft: 8 }}>{l.userName} · {formatKES(l.deposit)}</span>
            <span className="chip chip-info" style={{ marginLeft: 8 }}>Ready to pay deposit</span>
          </article>
        ))}
        {awaitingPay.length === 0 && <p className="u-muted">None waiting on deposit.</p>}
      </div>

      <h2 className="u-fs-15" style={{ marginBottom: 12 }}>Active loans</h2>
      <div className="u-flex-col u-gap-8" style={{ marginBottom: 28 }}>
        {active.map((l) => (
          <article key={l.id} className="card" style={{ padding: 16 }}>
            <strong>{l.title}</strong>
            <p className="u-muted u-fs-14" style={{ margin: '4px 0' }}>
              User: {l.userName} · Due: {l.dueAt ? new Date(l.dueAt).toLocaleDateString() : '—'}
            </p>
            <span className="chip chip-info">Active loan</span>
          </article>
        ))}
        {active.length === 0 && <p className="u-muted">No active loans.</p>}
      </div>

      <h2 className="u-fs-15" style={{ marginBottom: 12 }}>Return requests</h2>
      <div className="u-flex-col u-gap-8">
        {returns.map((l) => (
          <article key={l.id} className="card" style={{ padding: 16 }}>
            <strong>{l.title}</strong>
            <span className="u-muted" style={{ marginLeft: 8 }}>{l.userName}</span>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ marginLeft: 12 }}
              onClick={() => setStatus(l.id, 'returned', { returnedAt: new Date().toISOString() })}
            >
              Confirm returned
            </button>
          </article>
        ))}
        {returns.length === 0 && <p className="u-muted">No return requests.</p>}
      </div>
    </div>
  );
}
