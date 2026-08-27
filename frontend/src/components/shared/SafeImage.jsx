import { useState } from 'react';

<<<<<<< HEAD
export function SafeImage({ src, alt = '', className, style, aspect = '2/3' }) {
  const [err, setErr] = useState(false);
  if (err || !src) {
    return (
      <div
        className={className}
        style={{
          ...style,
          aspectRatio: aspect,
          background: 'linear-gradient(145deg, var(--well), var(--line))',
          display: 'grid',
          placeItems: 'center',
          color: 'var(--muted)',
          fontWeight: 800,
          fontSize: '1.4rem',
          borderRadius: 'inherit',
        }}
        aria-label={alt || 'Cover'}
      >
        {(alt || 'B')[0]?.toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      onError={() => setErr(true)}
=======
const FALLBACK =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300"><rect fill="#f0ebe6" width="200" height="300"/><text x="50%" y="50%" text-anchor="middle" fill="#78716c" font-family="sans-serif" font-size="14">No cover</text></svg>`
  );

export function SafeImage({ src, alt = '', className }) {
  const [err, setErr] = useState(false);
  return (
    <img
      src={err || !src ? FALLBACK : src}
      alt={alt}
      className={className}
      onError={() => setErr(true)}
      loading="lazy"
>>>>>>> fd34775763874bd90ed505782f080973551b04de
    />
  );
}
