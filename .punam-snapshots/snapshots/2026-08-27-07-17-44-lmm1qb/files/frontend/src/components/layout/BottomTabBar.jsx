import { NavLink } from 'react-router-dom';
import { Home, Store, Library, BookMarked, User } from 'lucide-react';
import { useAppSelector } from '../../library/storeHooks.js';
import styles from '../../styles/components/layout/BottomTabBar.module.css';

const tabs = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/shop', label: 'Shop', icon: Store },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/shelf', label: 'Shelf', icon: BookMarked, auth: true },
  { to: '/profile', label: 'You', icon: User, auth: true, guestTo: '/login' },
];

export function BottomTabBar() {
  const user = useAppSelector((s) => s.auth.user);
  return (
    <nav className={styles.bar} aria-label="Primary">
      {tabs.map(({ to, label, icon: Icon, end, auth, guestTo }) => {
        const href = auth && !user ? (guestTo || '/login') : to;
        return (
          <NavLink
            key={label}
            to={href}
            end={end}
            className={({ isActive }) =>
              `${styles.tab} ${isActive && !(auth && !user && href === '/login') ? styles.on : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive && !(auth && !user) ? 2.4 : 1.8} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
