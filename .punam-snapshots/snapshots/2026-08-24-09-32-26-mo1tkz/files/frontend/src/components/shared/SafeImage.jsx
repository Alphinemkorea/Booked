import { useState } from 'react';

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
    />
  );
}
