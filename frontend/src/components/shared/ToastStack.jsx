import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { dismissToast } from '../../library/slices/uiSlice.js';
import styles from '../../styles/components/shared/ToastStack.module.css';
import { cn } from '../../library/helpers/cn.js';

export function ToastStack() {
  const toasts = useAppSelector((s) => s.ui.toasts) || [];
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!toasts.length) return undefined;
    const t = setTimeout(() => dispatch(dismissToast(toasts[0].id)), 3200);
    return () => clearTimeout(t);
  }, [toasts, dispatch]);

  if (!toasts.length) return null;
  return (
    <div className={styles.stack} aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            styles.toast,
            t.tone === 'success' && styles.toastSuccess,
            (t.tone === 'error' || t.tone === 'danger') && styles.toastError,
            t.tone === 'info' && styles.toastInfo
          )}
          role="status"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
