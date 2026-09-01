import { NavLink, Outlet, Link, Navigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, ShoppingBag, Library, Shield, LogOut, Users } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../library/storeHooks.js';
import { logout } from '../../library/slices/authSlice.js';

export function AdminDashboard() {
  const user = useAppSelector((s) => s.auth.user);
  const orders = useAppSelector((s) => s.orders.purchases);
  const loans = useAppSelector((s) => s.orders.loans);
  const dispatch = useAppDispatch();

  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" replace />;

  const po = orders.filter((o) => o.status === 'pending').length;
  const pl = loans.filter((l) => l.status === 'pending').length;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        minHeight: 'calc(100vh - var(--nav-h))',
      }}
    >
      <aside
        style={{
          background: 'linear-gradient(180deg, #141210 0%, #1c1917 100%)',
          color: '#fafaf9',
          padding: '28px 18px',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, var(--primary), #ff8a65)',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            B
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>BOOOKED</div>
            <div
              style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                opacity: 0.45,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Shield size={10} /> Admin console
            </div>
          </div>
        </div>

        <div
          style={{
            margin: '18px 0 22px',
            padding: '10px 12px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            fontSize: 13,
          }}
        >
          <div style={{ opacity: 0.5, fontSize: 11, marginBottom: 2 }}>Signed in as</div>
          <div style={{ fontWeight: 700 }}>{user.name}</div>
          <div style={{ opacity: 0.55, fontSize: 12 }}>{user.email}</div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {[
            ['/admin', LayoutDashboard, 'Overview', null],
            ['/admin/books', BookOpen, 'Books', null],
            ['/admin/orders', ShoppingBag, 'Orders', po],
            ['/admin/lending', Library, 'Lending', pl],
            ['/admin/users', Users, 'Users', null],
          ].map(([to, Icon, label, badge]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 12,
                fontWeight: 600,
                fontSize: '0.95rem',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                background: isActive ? 'var(--primary)' : 'transparent',
                boxShadow: isActive ? '0 4px 16px rgba(255,107,61,0.3)' : 'none',
                transition: 'background 0.15s, color 0.15s',
              })}
            >
              <Icon size={18} /> {label}
              {badge > 0 && (
                <span
                  style={{
                    marginLeft: 'auto',
                    background: '#fff',
                    color: 'var(--primary)',
                    fontSize: 11,
                    fontWeight: 800,
                    minWidth: 20,
                    height: 20,
                    borderRadius: 999,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
          <Link
            to="/"
            style={{ fontSize: 14, opacity: 0.7, color: '#fff', padding: '8px 4px' }}
          >
            ← Back to store
          </Link>
          <button
            type="button"
            onClick={() => dispatch(logout())}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              color: 'rgba(255,255,255,0.8)',
              padding: '10px 12px',
              borderRadius: 10,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      <div style={{ padding: '32px 36px', background: 'var(--page)', overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}
