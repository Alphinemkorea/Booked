import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { setPurchaseStatus } from '../../library/slices/ordersSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { formatKES } from '../../library/json/booksData.js';

export function AdminOrders() {
	const orders = useAppSelector((state) => state.orders.purchases);
	const dispatch = useAppDispatch();
	return <div><h1 style={{ fontSize: '1.5rem' }}>Orders</h1><div style={{ display: 'grid', gap: 12, marginTop: 24 }}>{orders.map((order) => <article key={order.id} className="card" style={{ padding: 16 }}><strong>#{order.id}</strong><span style={{ marginLeft: 12 }}>{order.userName}</span><p>{formatKES(order.total)} · {order.status}</p>{order.status === 'pending' && <div style={{ display: 'flex', gap: 8 }}><button type="button" className="btn btn-primary btn-sm" onClick={() => { dispatch(setPurchaseStatus({ id: order.id, status: 'approved' })); dispatch(pushToast({ message: 'Order approved' })); }}>Approve</button><button type="button" className="btn btn-danger btn-sm" onClick={() => { dispatch(setPurchaseStatus({ id: order.id, status: 'rejected' })); dispatch(pushToast({ message: 'Order rejected', tone: 'info' })); }}>Reject</button></div>}</article>)}{orders.length === 0 && <p style={{ color: 'var(--muted)' }}>No orders yet.</p>}</div></div>;
}
