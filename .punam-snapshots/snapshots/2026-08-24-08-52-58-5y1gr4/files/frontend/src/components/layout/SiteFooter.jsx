import { Link } from 'react-router-dom';
import { BookedLogo } from '../shared/BookedLogo.jsx';
import { Instagram, Twitter, Mail, MapPin } from 'lucide-react';
import styles from '../../styles/components/layout/SiteFooter.module.css';

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.glow} aria-hidden />
      <div className={`container ${styles.inner}`}>
        <div className={styles.brandCol}>
          <BookedLogo />
          <p className={styles.tagline}>
            Buy. Borrow. Belong.<br />
            Your literary life — digital, instant, Kenya-first.
          </p>
          <div className={styles.social}>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className={styles.soc}><Twitter size={16} /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className={styles.soc}><Instagram size={16} /></a>
            <a href="mailto:hello@booked.ke" aria-label="Email" className={styles.soc}><Mail size={16} /></a>
          </div>
        </div>
        <div className={styles.cols}>
          <div>
            <h4>Explore</h4>
            <Link to="/shop">Shop — own forever</Link>
            <Link to="/library">Library — timed loans</Link>
            <Link to="/search">Search</Link>
            <Link to="/shelf?tab=wishlist">Wishlist</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/shelf">My Shelf</Link>
            <Link to="/shelf?tab=borrowing">Active loans</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/login">Sign in</Link>
          </div>
          <div>
            <h4>How it works</h4>
            <span>Pay with M-Pesa after approval</span>
            <span>Read online in your browser</span>
            <span>Loans lock when time ends</span>
            <span>Owned titles never expire</span>
          </div>
        </div>
      </div>
      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} BOOOKED · Nairobi</span>
        <span className={styles.loc}><MapPin size={12} /> KES · M-Pesa · Digital library</span>
      </div>
    </footer>
  );
}
