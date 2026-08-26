import { Link } from 'react-router-dom';
export function BookedLogo({ to = '/' }) {
  return (
    <Link to={to} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'var(--primary)' }} aria-label="BOOOKED home">
      <span style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--primary)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 14 }}>B</span>
      <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.04em', color: 'var(--ink)' }}>BO<span style={{ color: 'var(--primary)' }}>OO</span>KED</span>
    </Link>
  );
}
