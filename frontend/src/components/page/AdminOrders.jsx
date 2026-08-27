import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { setPurchaseStatus, setPurchases } from '../../library/slices/ordersSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { formatKES } from '../../library/json/booksData.js';
import { HAS_API } from '../../library/config.js';
import { adminApi } from '../../app/api/private/adminApi.js';
import { StatusChip } from '../shared/StatusChip.jsx';

export function AdminOrders() {
  const purchases = useAppSelector((s) => s.orders.purchases) || [];
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!HAS_API) return undefined;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await adminApi.orders.list();
        if (!cancelled && res.ok) dispatch(setPurchases(res.orders));
      } catch (e) {
        if (!cancelled) dispatch(pushToast({ message: e.message || 'Could not load orders', tone: 'error' }));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [dispatch]);

  const setStatus = async (id, status) => {
    try {
      if (HAS_API) {
        await adminApi.orders.setStatus(id, status);
      }
      dispatch(setPurchaseStatus({ id, status }));
      dispatch(pushToast({ message: `Order ${status}`, tone: 'success' }));
    } catch (e) {
      dispatch(pushToast({ message: e.message || 'Update failed', tone: 'error' }));
    }
  };

  const pending = purchases.filter((o) => o.status === 'pending');
  const rest = purchases.filter((o) => o.status !== 'pending');

  return (
    <div>
      <header className="u-flex u-justify-between u-items-center" style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem' }}>Purchase orders</h1>
        {loading && <span className="u-muted u-fs-13">Syncing…</span>}
      </header>

      <h2 className="u-fs-15" style={{ marginBottom: 12 }}>Pending ({pending.length})</h2>
      <div className="u-flex-col u-gap-12" style={{ marginBottom: 28 }}>
        {pending.map((o) => (
          <article key={o.id} className="card" style={{ padding: 16 }}>
            <div className="u-flex u-justify-between u-flex-wrap u-gap-12 u-items-center">
              <div>
                <strong>{o.title || o.bookTitle || `Order ${o.id}`}</strong>
                <p className="u-muted u-fs-14 u-m-0">
                  {o.userName || o.userEmail || o.userId} · {formatKES(o.total || o.amount || o.price)}
                </p>
              </div>
              <div className="u-flex u-gap-8">
                <button type="button" className="btn btn-primary btn-sm" onClick={() => setStatus(o.id, 'approved')}>Approve</button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStatus(o.id, 'rejected')}>Reject</button>
              </div>
            </div>
          </article>
        ))}
        {pending.length === 0 && <p className="u-muted">No pending purchase orders.</p>}
      </div>

      <h2 className="u-fs-15" style={{ marginBottom: 12 }}>All orders</h2>
      <div className="u-flex-col u-gap-8">
        {rest.map((o) => (
          <article key={o.id} className="card" style={{ padding: 14, display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <span>
              <strong>{o.title || o.bookTitle || o.id}</strong>
              <span className="u-muted u-fs-13"> · {formatKES(o.total || o.amount || 0)}</span>
            </span>
            <StatusChip status={o.status} />
          </article>
        ))}
        {rest.length === 0 && <p className="u-muted">No other orders yet.</p>}
      </div>
    </div>
  );
}
