import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../library/storeHooks.js';
import { attemptRegister, registerSuccess } from '../../library/slices/authSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
<<<<<<< HEAD
import { validateRegister } from '../../library/helpers/validation.js';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    const v = validateRegister({ name, email, password, confirm });
    setErrors(v); setFormError('');
    if (Object.keys(v).length) return;
    const r = attemptRegister({ name, email, password });
    if (!r.ok) { setFormError(r.error); return; }
    dispatch(registerSuccess(r));
    dispatch(pushToast({ message: 'Account created — welcome to BOOOKED' }));
    navigate('/');
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - var(--nav-h))' }}>
      <div style={{ backgroundImage: 'linear-gradient(rgba(28,25,23,.55),rgba(28,25,23,.7)),url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1400)', backgroundSize: 'cover', color: '#fff', padding: 48, display: 'flex', alignItems: 'flex-end' }}>
        <div><strong>BOOOKED</strong><h1 className="serif" style={{ fontSize: '2.6rem', color: '#fff', margin: '14px 0' }}>Join the shelf.</h1></div>
      </div>
      <div style={{ display: 'grid', placeItems: 'center', padding: 36 }}>
        <form onSubmit={submit} noValidate style={{ width: 'min(400px,100%)' }}>
          <h2 className="serif" style={{ fontSize: '2rem' }}>Create account</h2>
          {formError && <div style={{ background: 'var(--danger-soft)', color: 'var(--danger)', padding: 12, borderRadius: 12, fontWeight: 600, marginBottom: 14 }}>{formError}</div>}
          <label className="label">Full name</label>
          <input className={`input ${errors.name ? 'error' : ''}`} value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <p className="field-error">{errors.name}</p>}
          <label className="label" style={{ marginTop: 12 }}>Email</label>
          <input className={`input ${errors.email ? 'error' : ''}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <p className="field-error">{errors.email}</p>}
          <label className="label" style={{ marginTop: 12 }}>Password</label>
          <input className={`input ${errors.password ? 'error' : ''}`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {errors.password && <p className="field-error">{errors.password}</p>}
          <label className="label" style={{ marginTop: 12 }}>Confirm password</label>
          <input className={`input ${errors.confirm ? 'error' : ''}`} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          {errors.confirm && <p className="field-error">{errors.confirm}</p>}
          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 22 }}>Create account</button>
          <p style={{ textAlign: 'center', marginTop: 18, color: 'var(--muted)' }}>Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Sign in</Link></p>
        </form>
=======
import { GENRES } from '../../library/json/booksData.js';
import styles from '../../styles/components/page/AuthPage.module.css';
import { cn } from '../../library/helpers/cn.js';

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState('');

  const toggle = (g) => setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const res = attemptRegister({ name, email, password });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    const session = { ...res.session, genres };
    dispatch(registerSuccess({ account: { ...res.account, genres }, session }));
    dispatch(pushToast({ message: 'Account created', tone: 'success' }));
    navigate('/');
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h1 className={`serif ${styles.title}`}>Create account</h1>
        <p className={styles.sub}>Buy, borrow, and read digital books in your browser.</p>
        {error && <div className={styles.error} role="alert">{error}</div>}
        <form className={styles.form} onSubmit={onSubmit}>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" className="input" required value={name} onChange={(e) => setName(e.target.value)} />
          <label className="label" htmlFor="email">Email</label>
          <input id="email" className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="label" htmlFor="password">Password</label>
          <input id="password" className="input" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          <span className="label">Favorite genres</span>
          <div className={styles.genres}>
            {GENRES.map((g) => (
              <button key={g} type="button" className={cn('chip', genres.includes(g) && 'chip-primary')} onClick={() => toggle(g)}>
                {g}
              </button>
            ))}
          </div>
          <button type="submit" className="btn btn-primary btn-block">Create account</button>
        </form>
        <p className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
>>>>>>> fd34775763874bd90ed505782f080973551b04de
      </div>
    </div>
  );
}
