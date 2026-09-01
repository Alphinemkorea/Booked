import { SafeImage } from './SafeImage.jsx';

export function Avatar({ user, size = 40, className }) {
  const name = user?.name || 'U';
  const initial = name[0]?.toUpperCase() || 'U';
  const dim = typeof size === 'number' ? size : 40;
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={name}
        className={className}
        style={{
          width: dim,
          height: dim,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid color-mix(in srgb, var(--primary) 30%, transparent)',
        }}
      />
    );
  }
  return (
    <span
      className={className}
      style={{
        width: dim,
        height: dim,
        borderRadius: '50%',
        background: 'var(--primary)',
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        fontWeight: 800,
        fontSize: dim * 0.4,
        flexShrink: 0,
      }}
      aria-label={name}
    >
      {initial}
    </span>
  );
}
