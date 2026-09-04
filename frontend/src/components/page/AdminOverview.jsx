import { Link } from 'react-router-dom';
import { useAppSelector } from '../../library/storeHooks.js';
import { formatKES } from '../../library/json/booksData.js';

export function AdminOverview() {
	const orders = useAppSelector((state) => state.orders.purchases);
	const loans = useAppSelector((state) => state.orders.loans);
	const books = useAppSelector((state) => state.books.items);
	const pendingOrders = orders.filter((order) => order.status === 'pending');
	const pendingLoans = loans.filter((loan) => loan.status === 'pending');
	return <div><h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.5rem' }}>Overview</h1><div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, margin: '24px 0' }}>{[['Pending orders', pendingOrders.length], ['Pending loans', pendingLoans.length], ['Catalogue', books.length], ['Overdue', loans.filter((loan) => loan.status === 'active' && loan.dueAt < Date.now()).length]].map(([label, count]) => <div key={label} className="card" style={{ padding: 18 }}><div style={{ color: 'var(--muted)', fontSize: 12 }}>{label}</div><strong style={{ color: 'var(--primary)', fontSize: '1.85rem' }}>{count}</strong></div>)}</div><div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>{pendingOrders.length > 0 && <Link to="/admin/orders" className="btn btn-ghost">Review orders</Link>}{pendingLoans.length > 0 && <Link to="/admin/lending" className="btn btn-ghost">Review lending</Link>}</div><h2 style={{ fontSize: '1rem' }}>Recent orders</h2><div className="card" style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody>{orders.slice(0, 8).map((order) => <tr key={order.id}><td style={{ padding: 12 }}>#{order.id}</td><td style={{ padding: 12 }}>{order.userName}</td><td style={{ padding: 12 }}>{formatKES(order.total)}</td><td style={{ padding: 12 }}><span className="chip">{order.status}</span></td></tr>)}{orders.length === 0 && <tr><td style={{ padding: 12, color: 'var(--muted)' }}>No orders yet.</td></tr>}</tbody></table></div></div>;
}
