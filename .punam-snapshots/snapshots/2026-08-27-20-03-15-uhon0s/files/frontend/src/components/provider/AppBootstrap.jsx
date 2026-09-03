import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { fetchBooks } from '../../library/slices/booksSlice.js';
import { HAS_API } from '../../library/config.js';
import { ordersApi } from '../../app/api/public/ordersApi.js';
import { addPurchaseOrder, addLoan } from '../../library/slices/ordersSlice.js';

/**
 * Loads catalogue (and optionally user orders) from the Render API on startup.
 * When VITE_API_URL is unset, Redux keeps using local JSON seed.
 */
export function AppBootstrap({ children }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const status = useAppSelector((s) => s.books.status);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  useEffect(() => {
    if (!HAS_API || !user?.token) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const res = await ordersApi.listMine();
        if (cancelled || !res.ok) return;
        // Merge remote orders into local state (ids from server win)
        (res.purchases || []).forEach((o) => dispatch(addPurchaseOrder(o)));
        (res.loans || []).forEach((l) => dispatch(addLoan(l)));
      } catch (e) {
        console.warn('[orders] sync skipped', e.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch, user?.token, user?.id]);

  // Soft loading indicator only on first API load with empty list
  const showBoot = HAS_API && status === 'loading';

  return (
    <>
      {showBoot && (
        <div
          className="u-text-center u-muted u-fs-13"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            padding: '6px 12px',
            background: 'var(--primary-soft)',
            color: 'var(--primary-deep)',
            fontWeight: 700,
          }}
          role="status"
        >
          Loading catalogue from server…
        </div>
      )}
      {children}
    </>
  );
}
