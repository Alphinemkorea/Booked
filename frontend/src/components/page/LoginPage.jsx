import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../library/storeHooks.js';
import { attemptLogin, loginSuccess } from '../../library/slices/authSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { consumeIntent } from '../../library/helpers/intent.js';
import styles from '../../styles/components/page/AuthPage.module.css';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = attemptLogin(email, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    dispatch(loginSuccess(res.user));
    dispatch(pushToast({ message: `Welcome back, ${res.user.name.split(' ')[0]}`, tone: 'success' }));
    const intent = consumeIntent();
    const from = location.state?.from || intent?.from || '/';
    navigate(from, { replace: true });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={`serif ${styles.title}`}>Sign in</h1>
        <p className={styles.sub}>Access your shelf, bags, and digital library.</p>
        {error && <div className={styles.error} role="alert">{error}</div>}
        <form className={styles.form} onSubmit={onSubmit}>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" className="input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="label" htmlFor="password">Password</label>
          <input id="password" className="input" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="btn btn-primary btn-block">Sign in</button>
        </form>
        <p className={styles.footer}>
          New here? <Link to="/register">Create an account</Link>
        </p>
        <p className={`${styles.footer} u-fs-13`}>
          Demo admin: admin@booked.ke / admin123
        </p>
      </div>
    </div>
  );
}
