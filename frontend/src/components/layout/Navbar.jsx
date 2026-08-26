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
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
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
  );
}
