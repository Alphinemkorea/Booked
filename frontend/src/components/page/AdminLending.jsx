import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { setLoanStatus } from '../../library/slices/ordersSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';

export function AdminLending() {
	const loans = useAppSelector((state) => state.orders.loans);
	const dispatch = useAppDispatch();
	const updateLoan = (loan, status) => { dispatch(setLoanStatus({ id: loan.id, status })); dispatch(pushToast({ message: `Loan ${status}` })); };
	return <div><h1 style={{ fontSize: '1.5rem' }}>Lending</h1><div style={{ display: 'grid', gap: 12, marginTop: 24 }}>{loans.map((loan) => <article key={loan.id} className="card" style={{ padding: 16 }}><strong>{loan.title}</strong><p>{loan.userName} · {loan.status}</p>{loan.status === 'pending' && <button type="button" className="btn btn-primary btn-sm" onClick={() => updateLoan(loan, 'approved')}>Approve</button>}{loan.status === 'return_requested' && <button type="button" className="btn btn-primary btn-sm" onClick={() => updateLoan(loan, 'returned')}>Confirm returned</button>}</article>)}{loans.length === 0 && <p style={{ color: 'var(--muted)' }}>No lending requests yet.</p>}</div></div>;
}
