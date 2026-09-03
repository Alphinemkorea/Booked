import { Link } from 'react-router-dom';
import styles from '../../styles/components/shared/BookedLogo.module.css';
import { cn } from '../../library/helpers/cn.js';

export function BookedLogo({ className, to = '/' }) {
  return (
    <Link to={to} className={cn(styles.logo, className)} aria-label="BOOKED home">
      <span className={styles.mark} aria-hidden>B</span>
      <span className={styles.textCol}>
        <span className={styles.word}>BOOKED</span>
        <span className={styles.tag}>Digital bookstore</span>
      </span>
    </Link>
  );
}
