import { NavLink, Outlet, Link, Navigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ShoppingBag, Library } from 'lucide-react';
import { useAppSelector } from '../../library/storeHooks.js';

export function AdminDashboard() {
	const user = useAppSelector((state) => state.auth.user);
	const orders = useAppSelector((state) => state.orders.purchases);
	const loans = useAppSelector((state) => state.orders.loans);
	if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
	const pendingOrders = orders.filter((order) => order.status === 'pending').length;
	const pendingLoans = loans.filter((loan) => loan.status === 'pending').length;
	const links = [
		['/admin', LayoutDashboard, 'Overview', null],
		['/admin/books', BookOpen, 'Books', null],
		['/admin/orders', ShoppingBag, 'Orders', pendingOrders],
		['/admin/lending', Library, 'Lending', pendingLoans],
	];
	return (
		<div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - var(--nav-h))' }}>
			<aside style={{ background: '#1c1917', color: '#fafaf9', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
				<strong style={{ color: 'var(--primary)', fontSize: '1.15rem' }}>BOOKED</strong>
				<p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', opacity: .5, margin: '4px 0 24px' }}>Admin console</p>
				<nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
					{links.map(([to, Icon, label, badge]) => <NavLink key={to} to={to} end={to === '/admin'} style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10, fontWeight: 600, color: isActive ? '#fff' : 'rgba(255,255,255,.72)', background: isActive ? 'var(--primary)' : 'transparent' })}><Icon size={18} /> {label}{badge > 0 && <span style={{ marginLeft: 'auto' }}>{badge}</span>}</NavLink>)}
				</nav>
				<Link to="/" style={{ color: '#fff', opacity: .7, fontSize: 14 }}>Back to store</Link>
			</aside>
			<div style={{ padding: '28px 32px', background: 'var(--page)' }}><Outlet /></div>
		</div>
	);
}
