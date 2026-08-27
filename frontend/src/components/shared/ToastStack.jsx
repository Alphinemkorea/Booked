import { useEffect } from 'react';
<<<<<<< HEAD
import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { dismissToast } from '../../library/slices/uiSlice.js';

export function ToastStack() {
  const toasts = useAppSelector((s) => s.ui.toasts);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!toasts.length) return;
    const t = setTimeout(() => dispatch(dismissToast(toasts[toasts.length - 1].id)), 3400);
    return () => clearTimeout(t);
  }, [toasts, dispatch]);
  if (!toasts.length) return null;
  return (
    <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 1200, width: 'min(420px, calc(100% - 32px))', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ display: 'flex', gap: 12, padding: '14px 16px', borderRadius: 14, background: t.tone === 'info' ? '#0c4a6e' : '#1c1917', color: '#fafaf9', fontWeight: 600, boxShadow: 'var(--shadow-md)' }}>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button type="button" onClick={() => dispatch(dismissToast(t.id))} style={{ border: 'none', background: 'none', color: 'inherit', cursor: 'pointer' }}><X size={14} /></button>
=======
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
>>>>>>> origin/develop
        </div>
      ))}
    </div>
  );
}
