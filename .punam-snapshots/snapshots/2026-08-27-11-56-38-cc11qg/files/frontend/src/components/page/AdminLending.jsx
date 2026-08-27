import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { setLoanStatus } from '../../library/slices/ordersSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { formatKES } from '../../library/json/booksData.js';

/**
 * Loan state machine:
 * pending → approved (user must pay deposit) → active → return_requested → returned
 * pending → rejected
 * approved loans with deposit 0 can be activated immediately by admin if needed.
 */
export function AdminLending() {
  const loans = useAppSelector((s) => s.orders.loans);
  const dispatch = useAppDispatch();
  const requests = loans.filter((l) => l.status === 'pending');
  const awaitingPay = loans.filter((l) => l.status === 'approved');
  const active = loans.filter((l) => l.status === 'active');
  const returns = loans.filter((l) => l.status === 'return_requested');

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem', marginBottom: 8 }}>Lending</h1>
      <p style={{ color: 'var(--muted)', marginTop: 0, marginBottom: 24, fontSize: 14 }}>
        Approve requests → user pays deposit via M-Pesa → loan becomes active. Confirm returns to close the loan.
      </p>

      <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem' }}>Requests ({requests.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
        {requests.map((l) => (
          <article key={l.id} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                {l.cover && <img src={l.cover} alt="" style={{ width: 36, height: 52, objectFit: 'cover', borderRadius: 4 }} />}
                <div>
                  <strong>{l.title}</strong>
                  <p style={{ margin: 0, color: 'var(--muted)' }}>{l.author}</p>
                  <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 14 }}>
                    User: {l.userName} · {l.duration} days · Deposit {formatKES(l.deposit)}
                  </p>
                </div>
              </div>
              <span className="chip chip-warning">Awaiting approval</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  // If deposit is 0, activate immediately; else user pays first
                  if (!l.deposit || l.deposit <= 0) {
                    dispatch(setLoanStatus({
                      id: l.id,
                      status: 'active',
                      patch: { dueAt: Date.now() + (l.duration || 14) * 86400000, approvedAt: new Date().toISOString() },
                    }));
                    dispatch(pushToast({ message: 'Loan approved & activated (no deposit)' }));
                  } else {
                    dispatch(setLoanStatus({
                      id: l.id,
                      status: 'approved',
                      patch: { approvedAt: new Date().toISOString() },
                    }));
                    dispatch(pushToast({ message: 'Loan approved — user can pay deposit' }));
                  }
                }}
              >
                Approve
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => {
                  dispatch(setLoanStatus({ id: l.id, status: 'rejected' }));
                  dispatch(pushToast({ message: 'Loan rejected', tone: 'info' }));
                }}
              >
                Reject
              </button>
            </div>
          </article>
        ))}
        {requests.length === 0 && <p style={{ color: 'var(--muted)' }}>No pending requests.</p>}
      </div>

      <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem' }}>Awaiting deposit ({awaitingPay.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
        {awaitingPay.map((l) => (
          <article key={l.id} className="card" style={{ padding: 16 }}>
            <strong>{l.title}</strong>
            <span style={{ color: 'var(--muted)', marginLeft: 8 }}>{l.userName} · {formatKES(l.deposit)}</span>
            <span className="chip chip-info" style={{ marginLeft: 8 }}>Ready to pay deposit</span>
          </article>
        ))}
        {awaitingPay.length === 0 && <p style={{ color: 'var(--muted)' }}>None waiting on deposit.</p>}
      </div>

      <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem' }}>Active loans</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
        {active.map((l) => (
          <article key={l.id} className="card" style={{ padding: 16 }}>
            <strong>{l.title}</strong>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: '4px 0' }}>
              User: {l.userName} · Due: {l.dueAt ? new Date(l.dueAt).toLocaleDateString() : '—'}
            </p>
            <span className="chip chip-info">Active loan</span>
          </article>
        ))}
        {active.length === 0 && <p style={{ color: 'var(--muted)' }}>No active loans.</p>}
      </div>

      <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem' }}>Return requests</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {returns.map((l) => (
          <article key={l.id} className="card" style={{ padding: 16 }}>
            <strong>{l.title}</strong>
            <span style={{ color: 'var(--muted)', marginLeft: 8 }}>{l.userName}</span>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ marginLeft: 12 }}
              onClick={() => {
                dispatch(setLoanStatus({ id: l.id, status: 'returned', patch: { returnedAt: new Date().toISOString() } }));
                dispatch(pushToast({ message: 'Return confirmed — deposit refund due' }));
              }}
            >
              Confirm returned
            </button>
          </article>
        ))}
        {returns.length === 0 && <p style={{ color: 'var(--muted)' }}>No return requests.</p>}
      </div>
    </div>
  );
}
