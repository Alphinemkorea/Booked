import { useState } from 'react';

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
    />
  );
}
