<<<<<<< HEAD
import { useState } from 'react';
=======
import { useState, useRef, useEffect } from 'react';
>>>>>>> origin/develop
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
  const [step, setStep] = useState(1); // 1 details, 2 genres, 3 otp
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [genres, setGenres] = useState([]);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const fullName = `${firstName} ${lastName}`.trim();

  const toggle = (g) =>
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const goDetailsNext = (e) => {
    e.preventDefault();
    setError('');
    if (!firstName.trim() || !lastName.trim()) {
      setError('Enter your first and last name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!accepted) {
      setError('Please accept the Terms and Conditions to continue.');
      return;
    }
    setStep(2);
  };

  const goToOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setStep(3);
    setResendIn(45);
    setOtp(['', '', '', '', '', '']);
    dispatch(pushToast({ message: `Verification code sent to ${email}`, tone: 'success' }));
    setTimeout(() => otpRefs.current[0]?.focus(), 80);
  };

  const onOtpChange = (i, val) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    if (digit && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const onOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const completeRegister = async (e) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Enter the 6-digit verification code.');
      return;
    }
    if (code !== '123456' && code !== '000000') {
      setError('Invalid code. Use 123456 for demo.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const res = attemptRegister({ name: fullName, email, password });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    const session = { ...res.session, genres };
    dispatch(registerSuccess({ account: { ...res.account, genres }, session }));
    dispatch(pushToast({ message: 'Account verified — welcome to BOOKED', tone: 'success' }));
    navigate('/');
  };

  return (
    <div className={styles.darajaWrap}>
      <div className={styles.darajaCard}>
        <div className={styles.darajaBrand}>
          <span className={styles.darajaLogo}>B</span>
          <h1 className={styles.darajaProduct}>
            BOOKED <span className={styles.darajaAccent}>Hub</span>
          </h1>
        </div>

        {step === 1 && (
          <>
            <h2 className={styles.darajaTitle}>Sign Up</h2>
            <p className={styles.darajaSub}>Enter your details to create an account</p>
            {error && (
              <div className={styles.error} role="alert">
                {error}
              </div>
            )}
            <form className={styles.darajaForm} onSubmit={goDetailsNext}>
              <div className={styles.darajaRow}>
                <input
                  className={styles.darajaInput}
                  placeholder="First Name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                />
                <input
                  className={styles.darajaInput}
                  placeholder="Last Name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
              </div>
              <input
                className={styles.darajaInput}
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <div className={styles.darajaRow}>
                <input
                  className={styles.darajaInput}
                  type="password"
                  placeholder="Password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <input
                  className={styles.darajaInput}
                  type="password"
                  placeholder="Confirm Password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <label className={styles.darajaCheck}>
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <span>
                  I accept BOOKED&apos;s{' '}
                  <a href="#terms" onClick={(e) => e.preventDefault()}>
                    Terms and Conditions
                  </a>
                </span>
              </label>
              <button
                type="submit"
                className={styles.darajaSubmit}
                disabled={!accepted || loading}
              >
                Continue
              </button>
            </form>
            <p className={styles.darajaFooter}>
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className={styles.darajaTitle}>Your interests</h2>
            <p className={styles.darajaSub}>Pick genres to personalise recommendations</p>
            {error && (
              <div className={styles.error} role="alert">
                {error}
              </div>
            )}
            <form className={styles.darajaForm} onSubmit={goToOtp}>
              <div className={styles.genres}>
                {GENRES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={cn('chip', genres.includes(g) && 'chip-primary')}
                    onClick={() => toggle(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <button type="submit" className={styles.darajaSubmit} disabled={loading}>
                {loading ? 'Sending code…' : 'Continue & verify email'}
              </button>
              <button type="button" className={styles.darajaGhost} onClick={() => setStep(1)}>
                Back
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className={styles.darajaTitle}>Verify email</h2>
            <p className={styles.darajaSub}>
              Enter the 6-digit code sent to <strong>{email}</strong>
            </p>
            {error && (
              <div className={styles.error} role="alert">
                {error}
              </div>
            )}
            <form className={styles.darajaForm} onSubmit={completeRegister}>
              <div className={styles.otpRow}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    className={styles.otpInput}
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => onOtpChange(i, e.target.value)}
                    onKeyDown={(e) => onOtpKeyDown(i, e)}
                  />
                ))}
              </div>
              <button type="submit" className={styles.darajaSubmit} disabled={loading}>
                {loading ? 'Creating account…' : 'Verify & create account'}
              </button>
            </form>
            <p className={styles.resend}>
              Didn&apos;t get the code?{' '}
              <button type="button" disabled={resendIn > 0} onClick={goToOtp}>
                {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend'}
              </button>
            </p>
            <p className={styles.darajaFooter}>
              <button type="button" className={styles.forgot} onClick={() => setStep(2)}>
                ← Back
              </button>
            </p>
            <div className={styles.adminHint}>
              Demo verification code: <strong>123456</strong>
            </div>
          </>
        )}
>>>>>>> origin/develop
      </div>
    </div>
  );
}
