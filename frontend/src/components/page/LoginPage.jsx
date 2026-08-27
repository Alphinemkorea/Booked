import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../library/storeHooks.js';
import { attemptLogin, loginSuccess } from '../../library/slices/authSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
<<<<<<< HEAD
import { addPurchase, addLending, openDrawer } from '../../library/slices/cartSlice.js';
import { toggleWish } from '../../library/slices/wishlistSlice.js';
import { validateLogin } from '../../library/helpers/validation.js';
import { consumeIntent } from '../../library/helpers/intent.js';
import { books } from '../../library/json/booksData.js';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const resumeIntent = () => {
    const intent = consumeIntent();
    if (!intent) return from;
    const book = books.find((b) => b.id === intent.bookId);
    if (!book) return intent.from || from;
    if (intent.type === 'buy') {
      dispatch(addPurchase({
        bookId: book.id, title: book.title, author: book.author,
        price: book.price, cover: book.cover, qty: 1,
      }));
      dispatch(openDrawer('purchase'));
      dispatch(pushToast({ message: `“${book.title}” ready in your cart` }));
    } else if (intent.type === 'lend') {
      dispatch(addLending({
        bookId: book.id, title: book.title, author: book.author,
        cover: book.cover, deposit: book.deposit || 0, duration: book.loanDays || 14,
      }));
      dispatch(openDrawer('lending'));
      dispatch(pushToast({ message: `“${book.title}” ready in lending cart` }));
    } else if (intent.type === 'wish') {
      dispatch(toggleWish(book.id));
      dispatch(pushToast({ message: 'Saved to wishlist' }));
    }
    return intent.from || `/book/${book.id}`;
  };

  const submit = (e) => {
    e.preventDefault();
    const v = validateLogin({ email, password });
    setErrors(v);
    setFormError('');
    if (Object.keys(v).length) return;
    const result = attemptLogin(email, password);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    dispatch(loginSuccess(result.user));
    dispatch(pushToast({ message: `Welcome back, ${result.user.name.split(' ')[0]}` }));
    const dest = resumeIntent();
    navigate(dest);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - var(--nav-h))' }} className="auth-split">
      <div
        style={{
          backgroundImage: 'linear-gradient(rgba(15,14,13,.55), rgba(15,14,13,.72)), url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1400)',
          backgroundSize: 'cover',
          color: '#fff',
          padding: 48,
          display: 'flex',
          alignItems: 'flex-end',
        }}
        className="hide-mobile"
      >
        <div>
          <span style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>BOOOKED</span>
          <h1 className="serif" style={{ fontSize: '2.6rem', color: '#fff', margin: '14px 0' }}>Buy. Borrow. Belong.</h1>
          <p style={{ opacity: 0.92, maxWidth: 380, fontSize: '1.1rem' }}>Own the books that matter. Borrow the ones you are curious about.</p>
        </div>
      </div>
      <div style={{ display: 'grid', placeItems: 'center', padding: 36, background: 'var(--page)' }}>
        <form onSubmit={submit} noValidate style={{ width: 'min(400px, 100%)' }} className="fade-up">
          <h2 className="serif" style={{ fontSize: '2rem' }}>Welcome back</h2>
          <p style={{ color: 'var(--muted)', margin: '0 0 20px' }}>Sign in to continue where you left off</p>
          {formError && (
            <div style={{ background: 'var(--danger-soft)', color: 'var(--danger)', padding: '12px 14px', borderRadius: 12, fontWeight: 600, marginBottom: 14 }}>
              {formError}
            </div>
          )}
          <label className="label">Email</label>
          <input className={`input ${errors.email ? 'error' : ''}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          {errors.email && <p className="field-error">{errors.email}</p>}
          <label className="label" style={{ marginTop: 14 }}>Password</label>
          <input className={`input ${errors.password ? 'error' : ''}`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          {errors.password && <p className="field-error">{errors.password}</p>}
          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 22 }}>Sign in</button>
          <p style={{ textAlign: 'center', marginTop: 18, color: 'var(--muted)', lineHeight: 1.7 }}>
            Don&apos;t have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Register</Link>
            <br />
            <Link to="/" style={{ color: 'var(--primary)', fontWeight: 700 }}>Continue as guest →</Link>
          </p>
          <div style={{ marginTop: 28, padding: 16, background: 'var(--well)', borderRadius: 14, fontSize: 14, color: 'var(--muted)' }}>
            <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: 6 }}>Demo accounts</strong>
            <p style={{ margin: 3 }}>Admin: admin@booked.ke / admin123</p>
            <p style={{ margin: 3 }}>User: amara@example.com / user123</p>
          </div>
        </form>
      </div>
      <style>{`@media (max-width: 800px) { .auth-split { grid-template-columns: 1fr !important; } }`}</style>
=======
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
>>>>>>> fd34775763874bd90ed505782f080973551b04de
    </div>
  );
}
