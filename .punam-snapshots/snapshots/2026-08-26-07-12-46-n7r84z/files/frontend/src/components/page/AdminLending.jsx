import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { setLoanStatus } from '../../library/slices/ordersSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { formatKES } from '../../library/json/booksData.js';

export function AdminLending() {
  const loans = useAppSelector((s) => s.orders.loans);
  const dispatch = useAppDispatch();
  const requests = loans.filter((l) => l.status === 'pending');
  const active = loans.filter((l) => l.status === 'active');
  const returns = loans.filter((l) => l.status === 'return_requested');
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem', marginBottom: 24 }}>Lending</h1>
      <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem' }}>Requests ({requests.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {requests.map((l) => (
          <article key={l.id} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                {l.cover && <img src={l.cover} alt="" style={{ width: 36, height: 52, objectFit: 'cover', borderRadius: 4 }} />}
                <div><strong>{l.title}</strong><p style={{ margin: 0, color: 'var(--muted)' }}>{l.author}</p>
                  <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 14 }}>User: {l.userName} · {l.duration}d · Dep. {formatKES(l.deposit)}</p></div>
              </div>
              <span className="chip chip-warning">Pending</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => { dispatch(setLoanStatus({ id: l.id, status: 'active', patch: { dueAt: Date.now() + (l.duration || 14) * 86400000 } })); dispatch(pushToast({ message: 'Loan approved' })); }}>Approve</button>
              <button type="button" className="btn btn-danger btn-sm" onClick={() => { dispatch(setLoanStatus({ id: l.id, status: 'rejected' })); dispatch(pushToast({ message: 'Loan rejected', tone: 'info' })); }}>Reject</button>
            </div>
          </article>
        ))}
        {requests.length === 0 && <p style={{ color: 'var(--muted)' }}>No pending requests.</p>}
      </div>
      <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem' }}>Active</h2>
      {active.map((l) => <article key={l.id} className="card" style={{ padding: 16, marginBottom: 8 }}><strong>{l.title}</strong> · Due {l.dueAt ? new Date(l.dueAt).toLocaleDateString() : '—'} <span className="chip chip-info">Active</span></article>)}
      <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', marginTop: 24 }}>Returns</h2>
      {returns.map((l) => (
        <article key={l.id} className="card" style={{ padding: 16, marginBottom: 8 }}>
          <strong>{l.title}</strong>
          <button type="button" className="btn btn-primary btn-sm" style={{ marginLeft: 12 }} onClick={() => { dispatch(setLoanStatus({ id: l.id, status: 'returned' })); dispatch(pushToast({ message: 'Return confirmed' })); }}>Confirm returned</button>
        </article>
      ))}
      {returns.length === 0 && <p style={{ color: 'var(--muted)' }}>No return requests.</p>}
    </div>
  );
}
