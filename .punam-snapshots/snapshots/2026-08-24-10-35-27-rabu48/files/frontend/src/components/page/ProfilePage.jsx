import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { logout, updateProfile } from '../../library/slices/authSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { GENRES } from '../../library/json/booksData.js';

export function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState(user?.address || '');
  const [genres, setGenres] = useState(user?.genres || []);
  if (!user) return <div className="container empty-state"><Link to="/login" className="btn btn-primary">Sign in</Link></div>;
  return (
    <div className="container" style={{ padding: '36px 0', maxWidth: 560 }}>
      <h1 className="serif" style={{ textAlign: 'center', marginBottom: 28, fontSize: '2.2rem' }}>Profile</h1>
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 18 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '1.3rem' }}>{(user.name || 'U')[0].toUpperCase()}</div>
          <div><strong style={{ fontSize: '1.15rem' }}>{user.name}</strong><div style={{ color: 'var(--muted)' }}>{user.email}</div>{user.role === 'admin' && <span className="chip chip-primary">Admin</span>}</div>
        </div>
        <label className="label">Full name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="label" style={{ marginTop: 14 }}>Email</label>
        <input className="input" value={user.email} readOnly />
        <button type="button" className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => { dispatch(updateProfile({ name, address, genres })); dispatch(pushToast({ message: 'Profile saved' })); }}>Save changes</button>
      </div>
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-sans)', margin: '0 0 14px' }}>Genre preferences</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {GENRES.map((g) => (
            <button key={g} type="button" className={`chip ${genres.includes(g) ? 'chip-primary' : ''}`} style={{ cursor: 'pointer', border: 'none' }} onClick={() => setGenres((p) => p.includes(g) ? p.filter((x) => x !== g) : [...p, g])}>{g}</button>
          ))}
        </div>
      </div>
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-sans)', margin: '0 0 12px' }}>Delivery address</h3>
        <input className="input" placeholder="Add a delivery address" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>
      <div className="card" style={{ padding: 8 }}>
        <Link to="/shelf" style={{ display: 'block', padding: 14, fontWeight: 600 }}>My Shelf →</Link>
        {user.role === 'admin' && <Link to="/admin" style={{ display: 'block', padding: 14, fontWeight: 600, color: 'var(--primary)' }}>Admin console →</Link>}
        <button type="button" onClick={() => { dispatch(logout()); navigate('/'); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: 14, border: 'none', background: 'none', fontWeight: 600, color: 'var(--danger)', cursor: 'pointer' }}>Sign out →</button>
      </div>
    </div>
  );
}
