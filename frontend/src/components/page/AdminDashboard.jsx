<<<<<<< HEAD
export function AdminDashboard(){return (<div className="container" style={{padding:48,textAlign:'center'}}><h1 className="serif">AdminDashboard</h1><p style={{color:'var(--muted)'}}>Later feature.</p></div>);}
=======
import { NavLink, Outlet, Link, Navigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ShoppingBag, Library } from 'lucide-react';
import { useAppSelector } from '../../library/storeHooks.js';

export function AdminDashboard() {
  const user = useAppSelector((s) => s.auth.user);
  const orders = useAppSelector((s) => s.orders.purchases);
  const loans = useAppSelector((s) => s.orders.loans);
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  const po = orders.filter((o) => o.status === 'pending').length;
  const pl = loans.filter((l) => l.status === 'pending').length;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: 'calc(100vh - var(--nav-h))' }}>
      <aside style={{ background: '#1c1917', color: '#fafaf9', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.15rem' }}>BOOOKED</div>
        <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5, margin: '4px 0 24px' }}>Admin console</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {[
            ['/admin', LayoutDashboard, 'Overview', null],
            ['/admin/books', BookOpen, 'Books', null],
            ['/admin/orders', ShoppingBag, 'Orders', po],
            ['/admin/lending', Library, 'Lending', pl],
          ].map(([to, Icon, label, badge]) => (
            <NavLink key={to} to={to} end={to === '/admin'} style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10, fontWeight: 600, color: isActive ? '#fff' : 'rgba(255,255,255,.72)', background: isActive ? 'var(--primary)' : 'transparent' })}>
              <Icon size={18} /> {label}
              {badge > 0 && <span style={{ marginLeft: 'auto', background: '#fff', color: 'var(--primary)', fontSize: 11, fontWeight: 800, minWidth: 18, height: 18, borderRadius: 999, display: 'grid', placeItems: 'center' }}>{badge}</span>}
            </NavLink>
          ))}
        </nav>
        <Link to="/" style={{ marginTop: 'auto', fontSize: 14, opacity: 0.7, color: '#fff' }}>← Back to store</Link>
      </aside>
      <div style={{ padding: '28px 32px', background: 'var(--page)' }}><Outlet /></div>
    </div>
  );
}
>>>>>>> fd34775763874bd90ed505782f080973551b04de
