<<<<<<< HEAD
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Library, Moon, Sun, ChevronDown, Command, Heart } from 'lucide-react';
import { Avatar } from '../shared/Avatar.jsx';
import { BookedLogo } from '../shared/BookedLogo.jsx';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { setMode } from '../../library/slices/booksSlice.js';
import { openDrawer } from '../../library/slices/cartSlice.js';
import { logout } from '../../library/slices/authSlice.js';
import { toggleTheme, pushToast } from '../../library/slices/uiSlice.js';

export function Navbar() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s) => s.books.mode);
  const books = useAppSelector((s) => s.books.items);
  const purchase = useAppSelector((s) => s.cart.purchase);
  const lending = useAppSelector((s) => s.cart.lending);
  const user = useAppSelector((s) => s.auth.user);
  const wishCount = useAppSelector((s) => s.wishlist.ids.length);
  const theme = useAppSelector((s) => s.ui.theme);
  const [q, setQ] = useState('');
  const [menu, setMenu] = useState(false);
  const [cmd, setCmd] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
=======
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Library, Sun, Moon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { setMode } from '../../library/slices/booksSlice.js';
import { openDrawer } from '../../library/slices/cartSlice.js';
import { toggleTheme } from '../../library/slices/uiSlice.js';
import { logout } from '../../library/slices/authSlice.js';
import { BookedLogo } from '../shared/BookedLogo.jsx';
import { Avatar } from '../shared/Avatar.jsx';
import { MasterSearch } from '../view/MasterSearch.jsx';
import styles from '../../styles/components/layout/Navbar.module.css';
import { cn } from '../../library/helpers/cn.js';

export function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const purchase = useAppSelector((s) => s.cart.purchase) || [];
  const lending = useAppSelector((s) => s.cart.lending) || [];
  const wishCount = useAppSelector((s) => s.wishlist.ids.length);
  const theme = useAppSelector((s) => s.ui.theme);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
>>>>>>> origin/develop
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
<<<<<<< HEAD
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmd(true);
      }
      if (e.key === 'Escape') setCmd(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (cmd) setTimeout(() => inputRef.current?.focus(), 50);
  }, [cmd]);

  const suggestions = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return books.slice(0, 6);
    return books
      .filter(
        (b) =>
          b.title.toLowerCase().includes(term) ||
          b.author.toLowerCase().includes(term) ||
          b.genre.toLowerCase().includes(term)
      )
      .slice(0, 8);
  }, [q, books]);

  const goSearch = (e) => {
    e?.preventDefault();
    if (!q.trim()) return;
    setCmd(false);
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: scrolled ? 'var(--nav-h-scrolled)' : 'var(--nav-h)',
          background: 'color-mix(in srgb, var(--card) 90%, transparent)',
          backdropFilter: 'blur(20px) saturate(1.35)',
          borderBottom: '1px solid color-mix(in srgb, var(--line) 80%, transparent)', boxShadow: '0 4px 24px rgba(28,25,23,0.04)',
          transition: 'height 0.2s var(--ease)',
        }}
      >
        <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', gap: 14 }}>
          <BookedLogo />

          <div style={{ display: 'flex', background: 'var(--well)', borderRadius: 999, padding: 4 }} className="hide-mobile">
            {['shop', 'library'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  dispatch(setMode(m));
                  navigate('/' + m);
                }}
                style={{
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 999,
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: mode === m ? 'var(--primary)' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--muted)',
                  boxShadow: mode === m ? '0 2px 10px rgba(255,87,34,0.35)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {m[0].toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCmd(true)}
            className="hide-mobile"
            style={{
              flex: 1,
              maxWidth: 440,
              marginInline: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--well)',
              borderRadius: 999,
              padding: '11px 16px',
              border: '1.5px solid transparent',
              cursor: 'text',
              color: 'var(--muted)',
              fontWeight: 500,
            }}
          >
            <Search size={16} />
            <span style={{ flex: 1, textAlign: 'left' }}>Search books, authors, genre…</span>
            <kbd style={{ fontSize: 11, padding: '3px 7px', borderRadius: 6, background: 'var(--card)', border: '1px solid var(--line)', fontFamily: 'inherit' }}>⌘K</kbd>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
            <button
              type="button"
              className="hide-desktop"
              onClick={() => setCmd(true)}
              style={{ width: 42, height: 42, border: 'none', background: 'transparent', borderRadius: 12, cursor: 'pointer', color: 'var(--ink)' }}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              type="button"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              onClick={() => dispatch(toggleTheme())}
              style={{ width: 42, height: 42, border: 'none', background: 'transparent', borderRadius: 12, cursor: 'pointer', color: 'var(--ink)' }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              to={user ? '/shelf?tab=wishlist' : '/login'}
              title="Wishlist"
              style={{
                position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, borderRadius: 12, border: '1.5px solid var(--line)',
                background: 'var(--card)', color: 'var(--ink)',
              }}
            >
              <Heart size={18} />
              {wishCount > 0 && (
                <span style={{ position: 'absolute', top: 2, right: 2, minWidth: 16, height: 16, borderRadius: 999, background: '#e11d48', color: '#fff', fontSize: 10, fontWeight: 800, display: 'grid', placeItems: 'center' }}>{wishCount}</span>
              )}
            </Link>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => dispatch(openDrawer('purchase'))}
                title="Books to buy"
                style={{
                  position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6,
                  height: 40, padding: '0 12px', borderRadius: 12, border: '1.5px solid var(--line)',
                  background: 'var(--card)', cursor: 'pointer', color: 'var(--ink)', fontWeight: 700, fontSize: 13,
                }}
              >
                <ShoppingBag size={18} />
                <span className="hide-mobile">Buy bag</span>
                {purchase.length > 0 && (
                  <span style={{ minWidth: 18, height: 18, borderRadius: 999, background: 'var(--primary)', color: '#fff', fontSize: 11, fontWeight: 800, display: 'grid', placeItems: 'center', padding: '0 5px' }}>{purchase.length}</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => dispatch(openDrawer('lending'))}
                title="Books to borrow"
                style={{
                  position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 6,
                  height: 40, padding: '0 12px', borderRadius: 12, border: '1.5px solid var(--line)',
                  background: 'var(--card)', cursor: 'pointer', color: 'var(--ink)', fontWeight: 700, fontSize: 13,
                }}
              >
                <Library size={18} />
                <span className="hide-mobile">Borrow bag</span>
                {lending.length > 0 && (
                  <span style={{ minWidth: 18, height: 18, borderRadius: 999, background: '#0369a1', color: '#fff', fontSize: 11, fontWeight: 800, display: 'grid', placeItems: 'center', padding: '0 5px' }}>{lending.length}</span>
                )}
              </button>
            </div>
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setMenu((v) => !v)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, height: 40, padding: '0 12px 0 4px', borderRadius: 999, border: 'none', background: 'var(--primary)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  <Avatar user={user} size={32} />
                  <span className="hide-mobile">{user.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {menu && (
                  <div
                    style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 230, background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, boxShadow: 'var(--shadow-md)', padding: 8, zIndex: 50 }}
                    onMouseLeave={() => setMenu(false)}
                  >
                    <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid var(--line)', marginBottom: 4 }}>
                      <strong>{user.name}</strong>
                      <div style={{ fontSize: 13, color: 'var(--muted)' }}>{user.email}</div>
                    </div>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setMenu(false)} style={{ display: 'block', padding: '11px 12px', fontWeight: 600 }}>Admin console</Link>
                    )}
                    <Link to="/shelf" onClick={() => setMenu(false)} style={{ display: 'block', padding: '11px 12px', fontWeight: 600 }}>My Shelf</Link>
                    <Link to="/profile" onClick={() => setMenu(false)} style={{ display: 'block', padding: '11px 12px', fontWeight: 600 }}>Profile</Link>
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(logout());
                        dispatch(pushToast({ message: 'Signed out', tone: 'info' }));
                        setMenu(false);
                        navigate('/');
                      }}
                      style={{ width: '100%', textAlign: 'left', padding: '11px 12px', border: 'none', background: 'none', fontWeight: 600, color: 'var(--danger)', cursor: 'pointer' }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm hide-mobile">Sign in</Link>
            )}
          </div>
        </div>
      </header>

      {cmd && (
        <div
          onClick={() => setCmd(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(28,25,23,0.5)', zIndex: 300, display: 'flex', justifyContent: 'center', paddingTop: '12vh' }}
        >
          <div
            className="card"
            onClick={(e) => e.stopPropagation()}
            style={{ width: 'min(560px, calc(100% - 24px))', maxHeight: '70vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', animation: 'scaleIn 0.2s var(--ease)', boxShadow: 'var(--shadow-lg)' }}
          >
            <form onSubmit={goSearch} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderBottom: '1px solid var(--line)' }}>
              <Search size={18} color="var(--muted)" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search books, authors, or genre…"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '1.05rem' }}
              />
              <Command size={14} color="var(--muted)" />
            </form>
            <div style={{ overflow: 'auto', padding: 8 }}>
              {suggestions.length === 0 ? (
                <p style={{ padding: 20, color: 'var(--muted)', textAlign: 'center' }}>No matches. Try another title or genre.</p>
              ) : (
                suggestions.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setCmd(false);
                      setQ('');
                      navigate(`/book/${b.id}`);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                      padding: 10,
                      border: 'none',
                      background: 'transparent',
                      borderRadius: 12,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--well)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <img src={b.cover} alt="" style={{ width: 36, height: 52, objectFit: 'cover', borderRadius: 4 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ display: 'block' }}>{b.title}</strong>
                      <span style={{ color: 'var(--muted)', fontSize: 13 }}>{b.author} · {b.genre}</span>
                    </div>
                    <span className="chip chip-primary">{b.forLoan ? 'Borrow' : 'Buy'}</span>
                  </button>
                ))
              )}
            </div>
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line)', fontSize: 12, color: 'var(--muted)' }}>
              Enter to search all · Esc to close
            </div>
          </div>
        </div>
      )}
    </>
=======
    document.documentElement.setAttribute('data-theme', theme || 'light');
  }, [theme]);

  useEffect(() => {
    if (!menu) return undefined;
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menu]);

  const goShop = () => dispatch(setMode('shop'));
  const goLibrary = () => dispatch(setMode('library'));

  return (
    <header className={cn(styles.header, scrolled && styles.headerScrolled)}>
      <div className={styles.inner}>
        <BookedLogo />

        <nav className={styles.navLinks} aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => cn(styles.navLink, isActive && styles.navLinkActive)}>
            Discover
          </NavLink>
          <NavLink
            to="/shop"
            onClick={goShop}
            className={({ isActive }) => cn(styles.navLink, isActive && styles.navLinkActive)}
          >
            Shop
          </NavLink>
          <NavLink
            to="/library"
            onClick={goLibrary}
            className={({ isActive }) => cn(styles.navLink, isActive && styles.navLinkActive)}
          >
            Library
          </NavLink>
          <NavLink to="/shelf" className={({ isActive }) => cn(styles.navLink, isActive && styles.navLinkActive)}>
            Shelf
          </NavLink>
        </nav>

        <MasterSearch className={styles.searchWrap} />

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconCtl}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            className={styles.iconCtl}
            aria-label={`Wishlist${wishCount ? `, ${wishCount} items` : ''}`}
            title="Wishlist"
            onClick={() => navigate('/shelf?tab=wishlist')}
          >
            <Heart size={18} />
            {wishCount > 0 && <span className={cn(styles.badge, styles.badgeWish)}>{wishCount}</span>}
          </button>

          <button
            type="button"
            className={cn(styles.iconCtl, styles.iconCtlBuy)}
            aria-label={`Purchase bag${purchase.length ? `, ${purchase.length} items` : ''}`}
            title="Purchase bag"
            onClick={() => dispatch(openDrawer('purchase'))}
          >
            <ShoppingBag size={18} />
            {purchase.length > 0 && (
              <span className={cn(styles.badge, styles.badgeBuy)}>{purchase.length}</span>
            )}
          </button>

          <button
            type="button"
            className={cn(styles.iconCtl, styles.iconCtlLend)}
            aria-label={`Borrow bag${lending.length ? `, ${lending.length} items` : ''}`}
            title="Borrow bag"
            onClick={() => dispatch(openDrawer('lending'))}
          >
            <Library size={18} />
            {lending.length > 0 && (
              <span className={cn(styles.badge, styles.badgeLend)}>{lending.length}</span>
            )}
          </button>

          {user ? (
            <div className="u-relative" ref={menuRef}>
              <button
                type="button"
                className={styles.avatarBtn}
                onClick={() => setMenu((v) => !v)}
                aria-expanded={menu}
                aria-haspopup="menu"
                aria-label="Account menu"
                title={user.name}
              >
                <Avatar user={user} size={32} />
              </button>
              {menu && (
                <div className="menu-dropdown" role="menu">
                  <div className="menu-header">
                    <strong>{user.name}</strong>
                    <div className="u-fs-13 u-muted">{user.email}</div>
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" role="menuitem" onClick={() => setMenu(false)}>Admin console</Link>
                  )}
                  <Link to="/shelf" role="menuitem" onClick={() => setMenu(false)}>My Shelf</Link>
                  <Link to="/profile" role="menuitem" onClick={() => setMenu(false)}>Profile</Link>
                  <button
                    type="button"
                    className="menu-item"
                    role="menuitem"
                    onClick={() => {
                      dispatch(logout());
                      setMenu(false);
                      navigate('/');
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login" className="btn btn-ghost btn-sm hide-mobile">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join</Link>
            </div>
          )}
        </div>
      </div>
    </header>
>>>>>>> origin/develop
  );
}
