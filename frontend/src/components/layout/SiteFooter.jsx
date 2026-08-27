import { Link } from 'react-router-dom';
import { BookedLogo } from '../shared/BookedLogo.jsx';
import styles from '../../styles/components/layout/SiteFooter.module.css';
import { Twitter } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <BookedLogo />
          <p>Own digital books or borrow them. Instant access in your browser — no shipping.</p>
        </div>
        <div className={styles.col}>
          <h4>Explore</h4>
          <Link to="/shop">Shop</Link>
          <Link to="/library">Library</Link>
          <Link to="/search">Search</Link>
        </div>
        <div className={styles.col}>
          <h4>Account</h4>
          <Link to="/shelf">My Shelf</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Sign in</Link>
        </div>
        <div className={styles.col}>
          <h4>About</h4>
          <Link to="/">Discover</Link>
          <span className="u-muted u-fs-14 u-block">M-Pesa ready · Kenya</span>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} BOOKED</span>
        <div className={styles.social}>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X">
  <Twitter />
</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
        </div>
      </div>
    </footer>
  );
}
