import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../library/storeHooks.js';
import { attemptRegister, registerSuccess } from '../../library/slices/authSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
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
      </div>
    </div>
  );
}
