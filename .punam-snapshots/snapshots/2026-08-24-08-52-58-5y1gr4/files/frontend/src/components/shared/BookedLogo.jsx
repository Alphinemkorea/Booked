import { Link } from 'react-router-dom';

export function BookedLogo({ to = '/' }) {
  return (
    <Link
      to={to}
      aria-label="BOOOKED home"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        textDecoration: 'none',
        transition: 'transform 0.15s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
    >
      <span
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: 'linear-gradient(145deg, #ff6b3d, #ff5722 45%, #c2410c)',
          color: '#fff',
          display: 'grid',
          placeItems: 'center',
          fontWeight: 800,
          fontSize: 15,
          boxShadow: '0 4px 14px rgba(255, 87, 34, 0.35)',
          letterSpacing: '-0.04em',
        }}
      >
        B
      </span>
      <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.045em', color: 'var(--ink)' }}>
        BO<span style={{ color: 'var(--primary)' }}>OO</span>KED
      </span>
    </Link>
  );
}
