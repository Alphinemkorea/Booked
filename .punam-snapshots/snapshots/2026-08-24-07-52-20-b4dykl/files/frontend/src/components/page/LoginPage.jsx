import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../library/storeHooks.js';
import { attemptLogin, loginSuccess } from '../../library/slices/authSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { validateLogin } from '../../library/helpers/validation.js';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const from = useLocation().state?.from || '/';
  const submit = (e) => {
    e.preventDefault();
    const v = validateLogin({ email, password });
    setErrors(v); setFormError('');
    if (Object.keys(v).length) return;
    const r = attemptLogin(email, password);
    if (!r.ok) { setFormError(r.error); return; }
    dispatch(loginSuccess(r.user));
    dispatch(pushToast({ message: `Welcome back, ${r.user.name.split(' ')[0]}` }));
    navigate(from);
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 'calc(100vh - var(--nav-h))' }}>
      <div style={{ backgroundImage: 'linear-gradient(rgba(28,25,23,.55),rgba(28,25,23,.7)),url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1400)', backgroundSize: 'cover', color: '#fff', padding: 48, display: 'flex', alignItems: 'flex-end' }}>
        <div><strong>BOOOKED</strong><h1 className="serif" style={{ fontSize: '2.6rem', color: '#fff', margin: '14px 0' }}>Buy. Borrow. Belong.</h1><p style={{ opacity: 0.92, maxWidth: 380, fontSize: '1.1rem' }}>Own the books that matter. Borrow the ones you are curious about.</p></div>
      </div>
      <div style={{ display: 'grid', placeItems: 'center', padding: 36, background: 'var(--page)' }}>
        <form onSubmit={submit} noValidate style={{ width: 'min(400px,100%)' }}>
          <h2 className="serif" style={{ fontSize: '2rem' }}>Welcome back</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Sign in to continue</p>
          {formError && <div style={{ background: 'var(--danger-soft)', color: 'var(--danger)', padding: 12, borderRadius: 12, fontWeight: 600, marginBottom: 14 }}>{formError}</div>}
          <label className="label">Email</label>
          <input className={`input ${errors.email ? 'error' : ''}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          {errors.email && <p className="field-error">{errors.email}</p>}
          <label className="label" style={{ marginTop: 14 }}>Password</label>
          <input className={`input ${errors.password ? 'error' : ''}`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {errors.password && <p className="field-error">{errors.password}</p>}
          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 22 }}>Sign in</button>
          <p style={{ textAlign: 'center', marginTop: 18, color: 'var(--muted)' }}>Don&apos;t have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Register</Link><br /><Link to="/" style={{ color: 'var(--primary)', fontWeight: 700 }}>Continue as guest →</Link></p>
          <div style={{ marginTop: 28, padding: 16, background: 'var(--well)', borderRadius: 14, fontSize: 14, color: 'var(--muted)' }}>
            <strong style={{ color: 'var(--ink)', display: 'block', marginBottom: 6 }}>Demo accounts</strong>
            <p style={{ margin: 3 }}>Admin: admin@booked.ke / admin123</p>
            <p style={{ margin: 3 }}>User: amara@example.com / user123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
