import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Library, Moon, Sun, ChevronDown } from 'lucide-react';
import { BookedLogo } from '../shared/BookedLogo.jsx';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { setMode } from '../../library/slices/booksSlice.js';
import { openDrawer } from '../../library/slices/cartSlice.js';
import { logout } from '../../library/slices/authSlice.js';
import { toggleTheme, pushToast } from '../../library/slices/uiSlice.js';

export function Navbar() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.books.mode);
  const purchase = useAppSelector((s) => s.cart.purchase);
  const lending = useAppSelector((s) => s.cart.lending);
  const user = useAppSelector((s) => s.auth.user);
  const theme = useAppSelector((s) => s.ui.theme);
  const [q, setQ] = useState('');
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, height: 'var(--nav-h)', background: 'color-mix(in srgb, var(--card) 92%, transparent)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line)' }}>
      <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 16 }}>
        <BookedLogo />
        <div style={{ display: 'flex', background: 'var(--well)', borderRadius: 999, padding: 4 }}>
          {['shop', 'library'].map((m) => (
            <button key={m} type="button" onClick={() => { dispatch(setMode(m)); navigate('/' + m); }}
              style={{ border: 'none', padding: '8px 16px', borderRadius: 999, fontWeight: 700, cursor: 'pointer', background: mode === m ? 'var(--primary)' : 'transparent', color: mode === m ? '#fff' : 'var(--muted)' }}>
              {m[0].toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`); }}
          style={{ flex: 1, maxWidth: 480, marginInline: 'auto', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--well)', borderRadius: 999, padding: '10px 16px' }}>
          <Search size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search books, authors, or genre…" style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none' }} />
        </form>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button type="button" className="btn btn-ghost btn-sm" style={{ width: 42, height: 42, padding: 0 }} onClick={() => dispatch(toggleTheme())} title="Toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button type="button" onClick={() => dispatch(openDrawer('purchase'))} style={{ position: 'relative', width: 42, height: 42, border: 'none', background: 'transparent', borderRadius: 12, cursor: 'pointer', color: 'var(--ink)' }}>
            <ShoppingBag size={20} />
            {purchase.length > 0 && <span style={{ position: 'absolute', top: 4, right: 4, minWidth: 18, height: 18, borderRadius: 999, background: 'var(--primary)', color: '#fff', fontSize: 11, fontWeight: 800, display: 'grid', placeItems: 'center' }}>{purchase.length}</span>}
          </button>
          <button type="button" onClick={() => dispatch(openDrawer('lending'))} style={{ position: 'relative', width: 42, height: 42, border: 'none', background: 'transparent', borderRadius: 12, cursor: 'pointer', color: 'var(--ink)' }}>
            <Library size={20} />
            {lending.length > 0 && <span style={{ position: 'absolute', top: 4, right: 4, minWidth: 18, height: 18, borderRadius: 999, background: 'var(--primary)', color: '#fff', fontSize: 11, fontWeight: 800, display: 'grid', placeItems: 'center' }}>{lending.length}</span>}
          </button>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button type="button" onClick={() => setMenu((v) => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 40, padding: '0 12px 0 4px', borderRadius: 999, border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'grid', placeItems: 'center' }}>{(user.name || 'U')[0].toUpperCase()}</span>
                <ChevronDown size={14} />
              </button>
              {menu && (
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 220, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, boxShadow: 'var(--shadow-md)', padding: 8, zIndex: 50 }} onMouseLeave={() => setMenu(false)}>
                  <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid var(--line)', marginBottom: 4 }}>
                    <strong>{user.name}</strong>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>{user.email}</div>
                  </div>
                  {user.role === 'admin' && <Link to="/admin" onClick={() => setMenu(false)} style={{ display: 'block', padding: '11px 12px', fontWeight: 600 }}>Admin console</Link>}
                  <Link to="/shelf" onClick={() => setMenu(false)} style={{ display: 'block', padding: '11px 12px', fontWeight: 600 }}>My Shelf</Link>
                  <Link to="/profile" onClick={() => setMenu(false)} style={{ display: 'block', padding: '11px 12px', fontWeight: 600 }}>Profile</Link>
                  <button type="button" onClick={() => { dispatch(logout()); dispatch(pushToast({ message: 'Signed out', tone: 'info' })); setMenu(false); navigate('/'); }} style={{ width: '100%', textAlign: 'left', padding: '11px 12px', border: 'none', background: 'none', fontWeight: 600, color: 'var(--danger)', cursor: 'pointer' }}>Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
