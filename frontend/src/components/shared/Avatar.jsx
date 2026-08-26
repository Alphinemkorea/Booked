import styles from '../../styles/components/shared/Avatar.module.css';
import { cn } from '../../library/helpers/cn.js';

export function Avatar({ user, size = 40, className, editable, onPick }) {
  const name = user?.name || 'U';
  const initial = name[0]?.toUpperCase() || 'U';
  const dim = typeof size === 'number' ? size : 40;

  return (
    <span className={cn(styles.wrap, className)} style={{ '--avatar-size': `${dim}px` }}>
      {user?.avatar ? (
        <img src={user.avatar} alt={name} className={styles.img} />
      ) : (
        <span className={styles.fallback} aria-label={name}>{initial}</span>
      )}
      {editable && (
        <label className={styles.camera} title="Upload photo">
          <input
            type="file"
            accept="image/*"
            className="u-sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file || !onPick) return;
              const reader = new FileReader();
              reader.onload = () => onPick(String(reader.result || ''));
              reader.readAsDataURL(file);
            }}
          />
          ✎
        </label>
      )}
    </span>
  );
}
