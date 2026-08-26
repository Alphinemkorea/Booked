import { Link } from 'react-router-dom';
import { BookedLogo } from '../shared/BookedLogo.jsx';
export function SiteFooter() {
  return (
    <footer style={{ background: 'var(--well)', marginTop: 64, padding: '48px 0 24px', borderTop: '1px solid var(--line)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 32, marginBottom: 32 }}>
        <div><BookedLogo /><p style={{ color: 'var(--muted)', marginTop: 12 }}>Buy. Borrow. Belong. Your literary life in one place.</p></div>
        <div><h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)', marginBottom: 14 }}>Shop</h4>
          <Link to="/shop" style={{ display: 'block', marginBottom: 10, fontWeight: 600 }}>Browse shop</Link>
          <Link to="/library" style={{ display: 'block', marginBottom: 10, fontWeight: 600 }}>Browse library</Link>
        </div>
        <div><h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)', marginBottom: 14 }}>Account</h4>
          <Link to="/shelf" style={{ display: 'block', marginBottom: 10, fontWeight: 600 }}>My shelf</Link>
          <Link to="/login" style={{ display: 'block', marginBottom: 10, fontWeight: 600 }}>Sign in</Link>
        </div>
        <div><h4 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)', marginBottom: 14 }}>Help</h4>
          <span style={{ display: 'block', marginBottom: 10, fontWeight: 600, color: 'var(--muted)' }}>Borrow policy</span>
          <span style={{ display: 'block', marginBottom: 10, fontWeight: 600, color: 'var(--muted)' }}>M-Pesa payments</span>
        </div>
      </div>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, paddingTop: 20, borderTop: '1px solid var(--line)', fontSize: 14, color: 'var(--muted)' }}>
        <span>© 2026 BOOOKED</span>
        <span>Nairobi · KES · M-Pesa</span>
      </div>
    </footer>
  );
}
