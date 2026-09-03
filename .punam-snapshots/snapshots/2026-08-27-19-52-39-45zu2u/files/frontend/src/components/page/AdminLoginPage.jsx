import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { attemptAdminLogin, loginSuccess } from '../../library/slices/authSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import styles from '../../styles/components/page/AuthPage.module.css';

export function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const existing = useAppSelector((s) => s.auth.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (existing?.role === 'admin') return <Navigate to="/admin" replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const res = attemptAdminLogin(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    dispatch(loginSuccess(res.user));
    dispatch(pushToast({ message: `Admin access granted — ${res.user.name}`, tone: 'success' }));
    navigate('/admin', { replace: true });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.logoRow}>
          <div className={styles.logoMark}>
            <Shield size={20} strokeWidth={2.5} />
          </div>
        </div>
        <h1 className={`serif ${styles.title}`}>Admin sign in</h1>
        <p className={styles.sub}>
          Restricted access to the BOOKED admin console. Only administrator accounts can continue.
        </p>

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.fieldGroup}>
            <label className="label" htmlFor="admin-email">
              Admin email
            </label>
            <input
              id="admin-email"
              className="input"
              type="email"
              autoComplete="username"
              required
              placeholder="admin@booked.ke"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className="label" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              className="input"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Verifying…' : 'Sign in to admin panel'}
          </button>
        </form>

        <p className={styles.footer}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={14} /> Back to customer login
          </Link>
        </p>

        <div className={styles.adminHint}>
          <strong>Demo admin</strong>
          <br />
          admin@booked.ke / admin123
        </div>
      </div>
    </div>
  );
}
