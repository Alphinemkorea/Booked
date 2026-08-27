import { useState, useRef, useEffect } from 'react';
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

  const [method, setMethod] = useState('password'); // password | otp
  const [step, setStep] = useState('credentials'); // credentials | otp
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const finishLogin = (user) => {
    dispatch(loginSuccess(user));
    dispatch(pushToast({ message: `Welcome back, ${user.name.split(' ')[0]}`, tone: 'success' }));
    const intent = consumeIntent();
    const from = location.state?.from || intent?.from || (user.role === 'admin' ? '/admin' : '/');
    navigate(from, { replace: true });
  };

  const onPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const res = attemptLogin(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    finishLogin(res.user);
  };

  const sendOtp = async (e) => {
    e?.preventDefault();
    setError('');
    if (!email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setStep('otp');
    setResendIn(45);
    setOtp(['', '', '', '', '', '']);
    dispatch(pushToast({ message: `OTP sent to ${email}`, tone: 'success' }));
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
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Enter the 6-digit code.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    // Demo: accept 123456 or last 6 of a mock
    if (code !== '123456' && code !== '000000') {
      setLoading(false);
      setError('Invalid or expired code. Try 123456 for demo.');
      return;
    }
    const res = attemptLogin(email, 'user123') || attemptLogin(email, 'admin123');
    // Fallback: try to find user by email only for OTP demo
    const users = JSON.parse(localStorage.getItem('bk-users') || '[]');
    const found = users.find((u) => u.email?.toLowerCase() === email.toLowerCase().trim());
    setLoading(false);
    if (found) {
      const { password: _, ...session } = found;
      finishLogin(session);
      return;
    }
    // Allow admin demo email
    if (email.toLowerCase() === 'admin@booked.ke') {
      finishLogin({ id: 'admin1', email: 'admin@booked.ke', name: 'Admin User', role: 'admin', genres: [], address: '' });
      return;
    }
    setError('No account found for this email. Please register first.');
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.logoRow}>
          <div className={styles.logoMark}>B</div>
        </div>

        {step === 'credentials' && (
          <>
            <h1 className={`serif ${styles.title}`}>Welcome back</h1>
            <p className={styles.sub}>Sign in to your library, orders, and reading progress.</p>

            <div className={styles.methodTabs}>
              <button
                type="button"
                className={`${styles.methodTab} ${method === 'password' ? styles.on : ''}`}
                onClick={() => setMethod('password')}
              >
                Password
              </button>
              <button
                type="button"
                className={`${styles.methodTab} ${method === 'otp' ? styles.on : ''}`}
                onClick={() => setMethod('otp')}
              >
                Email OTP
              </button>
            </div>

            {error && <div className={styles.error} role="alert">{error}</div>}

            {method === 'password' ? (
              <form className={styles.form} onSubmit={onPasswordSubmit}>
                <div className={styles.fieldGroup}>
                  <label className="label" htmlFor="email">Email</label>
                  <input
                    id="email"
                    className="input"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <div className={styles.passwordRow}>
                    <label className="label" htmlFor="password">Password</label>
                    <button type="button" className={styles.forgot} onClick={() => dispatch(pushToast({ message: 'Password reset link sent (demo)', tone: 'info' }))}>
                      Forgot?
                    </button>
                  </div>
                  <input
                    id="password"
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
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            ) : (
              <form className={styles.form} onSubmit={sendOtp}>
                <div className={styles.fieldGroup}>
                  <label className="label" htmlFor="email-otp">Email</label>
                  <input
                    id="email-otp"
                    className="input"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? 'Sending code…' : 'Send one-time code'}
                </button>
              </form>
            )}

            <div className={styles.divider}>or continue with</div>
            <div className={styles.socialRow}>
              <button type="button" className={styles.socialBtn} onClick={() => dispatch(pushToast({ message: 'Google sign-in (demo)', tone: 'info' }))}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button type="button" className={styles.socialBtn} onClick={() => dispatch(pushToast({ message: 'Apple sign-in (demo)', tone: 'info' }))}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Apple
              </button>
            </div>

            <p className={styles.footer}>
              New to Boooked? <Link to="/register">Create an account</Link>
            </p>
            <p className={styles.footer} style={{ marginTop: 12 }}>
              <Link to="/admin/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 800 }}>
                Login as Admin →
              </Link>
            </p>
            <div className={styles.adminHint}>
              <strong>Demo accounts</strong><br />
              User: amara@example.com / user123<br />
              Admin: admin@booked.ke / admin123 · OTP demo code: <strong>123456</strong>
            </div>
          </>
        )}

        {step === 'otp' && (
          <>
            <div className={styles.steps}>
              <span className={`${styles.stepDot} ${styles.on}`} />
              <span className={`${styles.stepDot} ${styles.on}`} />
            </div>
            <h1 className={`serif ${styles.title}`}>Enter code</h1>
            <p className={styles.sub}>
              We sent a 6-digit code to <strong style={{ color: 'var(--ink)' }}>{email}</strong>
            </p>
            {error && <div className={styles.error} role="alert">{error}</div>}
            <form className={styles.form} onSubmit={verifyOtp}>
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
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Verifying…' : 'Verify & sign in'}
              </button>
            </form>
            <p className={styles.resend}>
              Didn’t receive it?{' '}
              <button type="button" disabled={resendIn > 0} onClick={sendOtp}>
                {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend code'}
              </button>
            </p>
            <p className={styles.footer}>
              <button type="button" className={styles.forgot} onClick={() => { setStep('credentials'); setError(''); }}>
                ← Use a different email
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
