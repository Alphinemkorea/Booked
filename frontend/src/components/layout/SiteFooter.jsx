import { Link } from 'react-router-dom';
import { BookedLogo } from '../shared/BookedLogo.jsx';
<<<<<<< HEAD
import { Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer style={{
      position: 'relative', marginTop: 80, padding: '64px 0 28px',
      background: 'linear-gradient(180deg, var(--page) 0%, var(--well) 45%, var(--well) 100%)',
      borderTop: '1px solid var(--line)', overflow: 'hidden',
    }}>
      <div aria-hidden style={{
        position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
        width: 480, height: 200,
        background: 'radial-gradient(ellipse, color-mix(in srgb, var(--primary) 22%, transparent), transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="container" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.3fr 2fr', gap: 48, marginBottom: 40 }}>
        <div style={{ maxWidth: 320 }}>
          <BookedLogo />
          <p style={{ margin: '18px 0 20px', color: 'var(--muted)', fontSize: '0.98rem', lineHeight: 1.55 }}>
            Buy. Borrow. Belong.<br />
            Digital books — instant in your browser. No shipping.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              ['https://twitter.com', Twitter],
              ['https://instagram.com', Instagram],
              ['mailto:hello@booked.ke', Mail],
            ].map(([href, Icon]) => (
              <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                style={{
                  width: 38, height: 38, borderRadius: 12, border: '1px solid var(--line)',
                  background: 'var(--card)', display: 'grid', placeItems: 'center', color: 'var(--ink)',
                }}>
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          <div>
            <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', margin: '0 0 16px', fontWeight: 800 }}>Explore</h4>
            <Link to="/shop" style={{ display: 'block', marginBottom: 11, fontWeight: 600 }}>Shop — own forever</Link>
            <Link to="/library" style={{ display: 'block', marginBottom: 11, fontWeight: 600 }}>Library — timed loans</Link>
            <Link to="/search" style={{ display: 'block', marginBottom: 11, fontWeight: 600 }}>Search</Link>
            <Link to="/shelf?tab=wishlist" style={{ display: 'block', marginBottom: 11, fontWeight: 600 }}>Wishlist</Link>
          </div>
          <div>
            <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', margin: '0 0 16px', fontWeight: 800 }}>Account</h4>
            <Link to="/shelf" style={{ display: 'block', marginBottom: 11, fontWeight: 600 }}>My Shelf</Link>
            <Link to="/shelf?tab=borrowing" style={{ display: 'block', marginBottom: 11, fontWeight: 600 }}>Active loans</Link>
            <Link to="/profile" style={{ display: 'block', marginBottom: 11, fontWeight: 600 }}>Profile</Link>
            <Link to="/login" style={{ display: 'block', marginBottom: 11, fontWeight: 600 }}>Sign in</Link>
          </div>
          <div>
            <h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', margin: '0 0 16px', fontWeight: 800 }}>How it works</h4>
            <span style={{ display: 'block', marginBottom: 11, color: 'var(--muted)', fontSize: 14 }}>Pay with M-Pesa after approval</span>
            <span style={{ display: 'block', marginBottom: 11, color: 'var(--muted)', fontSize: 14 }}>Read online in your browser</span>
            <span style={{ display: 'block', marginBottom: 11, color: 'var(--muted)', fontSize: 14 }}>Loans lock when time ends</span>
            <span style={{ display: 'block', marginBottom: 11, color: 'var(--muted)', fontSize: 14 }}>Owned titles never expire</span>
          </div>
        </div>
      </div>
      <div className="container" style={{
        position: 'relative', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        paddingTop: 22, borderTop: '1px solid var(--line)', fontSize: 14, color: 'var(--muted)', fontWeight: 600,
      }}>
        <span>© {new Date().getFullYear()} BOOOKED · Nairobi</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={12} /> KES · M-Pesa · Digital library
        </span>
      </div>
    </footer>
  );
}
=======
import styles from '../../styles/components/layout/SiteFooter.module.css';

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
          <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X">X</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
        </div>
      </div>
    </footer>
  );
}
>>>>>>> origin/develop
