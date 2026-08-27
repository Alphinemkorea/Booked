import { Link } from 'react-router-dom';
<<<<<<< HEAD

export function BookedLogo({ to = '/' }) {
  return (
    <Link to={to} aria-label="BOOOKED home" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
      <span style={{
        width: 34, height: 34, borderRadius: 10,
        background: 'linear-gradient(145deg, #ff6b3d, #ff5722 45%, #c2410c)',
        color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 15,
        boxShadow: '0 4px 14px rgba(255, 87, 34, 0.35)', letterSpacing: '-0.04em',
      }}>B</span>
      <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.045em', color: 'var(--ink)' }}>
        BO<span style={{ color: 'var(--primary)' }}>OO</span>KED
=======
import styles from '../../styles/components/shared/BookedLogo.module.css';
import { cn } from '../../library/helpers/cn.js';

export function BookedLogo({ className, to = '/' }) {
  return (
    <Link to={to} className={cn(styles.logo, className)} aria-label="BOOOKED home">
      <span className={styles.mark} aria-hidden>B</span>
      <span className={styles.textCol}>
        <span className={styles.word}>
          <span className={styles.wordAccent}>BOOOK</span>ED
        </span>
        <span className={styles.tag}>Digital bookstore</span>
>>>>>>> fd34775763874bd90ed505782f080973551b04de
      </span>
    </Link>
  );
}
