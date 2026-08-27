import { useState, useRef, useEffect } from 'react';
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
  const [step, setStep] = useState(1); // 1 details, 2 genres, 3 otp
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const toggle = (g) => setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const goToOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
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
    const res = attemptRegister({ name, email, password });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    const session = { ...res.session, genres };
    dispatch(registerSuccess({ account: { ...res.account, genres }, session }));
    dispatch(pushToast({ message: 'Account verified — welcome to Boooked', tone: 'success' }));
    navigate('/');
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.logoRow}>
          <div className={styles.logoMark}>B</div>
        </div>

        <div className={styles.steps}>
          <span className={`${styles.stepDot} ${step >= 1 ? styles.on : ''}`} />
          <span className={`${styles.stepDot} ${step >= 2 ? styles.on : ''}`} />
          <span className={`${styles.stepDot} ${step >= 3 ? styles.on : ''}`} />
        </div>

        {step === 1 && (
          <>
            <h1 className={`serif ${styles.title}`}>Create account</h1>
            <p className={styles.sub}>Buy, borrow, and read digital books in your browser.</p>
            {error && <div className={styles.error} role="alert">{error}</div>}
            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                setError('');
                setStep(2);
              }}
            >
              <div className={styles.fieldGroup}>
                <label className="label" htmlFor="name">Full name</label>
                <input id="name" className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Amara Wanjiku" />
              </div>
              <div className={styles.fieldGroup}>
                <label className="label" htmlFor="email">Email</label>
                <input id="email" className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className={styles.fieldGroup}>
                <label className="label" htmlFor="password">Password</label>
                <input id="password" className="input" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Continue</button>
            </form>
            <div className={styles.divider}>or</div>
            <div className={styles.socialRow}>
              <button type="button" className={styles.socialBtn} onClick={() => dispatch(pushToast({ message: 'Google sign-up (demo)', tone: 'info' }))}>Google</button>
              <button type="button" className={styles.socialBtn} onClick={() => dispatch(pushToast({ message: 'Apple sign-up (demo)', tone: 'info' }))}>Apple</button>
            </div>
            <p className={styles.footer}>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className={`serif ${styles.title}`}>Your interests</h1>
            <p className={styles.sub}>Pick a few genres so we can personalise recommendations.</p>
            {error && <div className={styles.error} role="alert">{error}</div>}
            <form className={styles.form} onSubmit={goToOtp}>
              <div className={styles.genres}>
                {GENRES.map((g) => (
                  <button key={g} type="button" className={cn('chip', genres.includes(g) && 'chip-primary')} onClick={() => toggle(g)}>
                    {g}
                  </button>
                ))}
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Sending code…' : 'Continue & verify email'}
              </button>
              <button type="button" className="btn btn-ghost btn-block" onClick={() => setStep(1)}>Back</button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className={`serif ${styles.title}`}>Verify email</h1>
            <p className={styles.sub}>
              Enter the 6-digit code sent to <strong style={{ color: 'var(--ink)' }}>{email}</strong>
            </p>
            {error && <div className={styles.error} role="alert">{error}</div>}
            <form className={styles.form} onSubmit={completeRegister}>
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
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Creating account…' : 'Verify & create account'}
              </button>
            </form>
            <p className={styles.resend}>
              Didn’t get the code?{' '}
              <button type="button" disabled={resendIn > 0} onClick={goToOtp}>
                {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend'}
              </button>
            </p>
            <p className={styles.footer}>
              <button type="button" className={styles.forgot} onClick={() => setStep(2)}>← Back</button>
            </p>
            <div className={styles.adminHint}>Demo verification code: <strong>123456</strong></div>
          </>
        )}
      </div>
    </div>
  );
}
