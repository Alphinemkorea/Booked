import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { setPurchaseStatus } from '../../library/slices/ordersSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { formatKES } from '../../library/json/booksData.js';

export function AdminOrders() {
  const orders = useAppSelector((s) => s.orders.purchases);
  const dispatch = useAppDispatch();
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem', marginBottom: 24 }}>Orders</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders.length === 0 && <p style={{ color: 'var(--muted)' }}>No orders yet.</p>}
        {orders.map((o) => (
          <article key={o.id} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
              <div><span className="chip">#{o.id}</span> <span className={`chip chip-${o.status === 'pending' ? 'warning' : o.status === 'paid' ? 'success' : 'info'}`}>{o.status}</span>
                <p style={{ margin: '6px 0', color: 'var(--muted)' }}>User: {o.userName} · {new Date(o.createdAt).toLocaleString()}</p></div>
              <strong className="price">{formatKES(o.total)}</strong>
            </div>
            <ul style={{ color: 'var(--muted)' }}>{o.items.map((i, idx) => <li key={idx}>{i.title} ×{i.qty}</li>)}</ul>
            {o.status === 'pending' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => { dispatch(setPurchaseStatus({ id: o.id, status: 'approved' })); dispatch(pushToast({ message: 'Order approved — user can pay' })); }}>Approve</button>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => { dispatch(setPurchaseStatus({ id: o.id, status: 'rejected' })); dispatch(pushToast({ message: 'Order rejected', tone: 'info' })); }}>Reject</button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
