import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { logout, updateProfile } from '../../library/slices/authSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { GENRES } from '../../library/json/booksData.js';
import { Avatar } from '../shared/Avatar.jsx';

const MAX_AVATAR = 2 * 1024 * 1024; // 2MB — swap for backend upload URL later

export function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user);
  const wishCount = useAppSelector((s) => s.wishlist.ids.length);
  const purchases = useAppSelector((s) => s.orders.purchases) || [];
  const loans = useAppSelector((s) => s.orders.loans) || [];
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState(user?.address || '');
  const [genres, setGenres] = useState(user?.genres || []);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  if (!user) {
    return (
      <div className="container empty-state">
        <h1 className="serif">Profile</h1>
        <Link to="/login" className="btn btn-primary">Sign in</Link>
      </div>
    );
  }

  const onAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      dispatch(pushToast({ message: 'Please choose an image (JPG, PNG, WebP)', tone: 'info' }));
      return;
    }
    if (file.size > MAX_AVATAR) {
      dispatch(pushToast({ message: 'Image must be under 2MB', tone: 'info' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setAvatarPreview(dataUrl);
      // Local for now — replace with: await userApi.uploadAvatar(file) → { url }
      dispatch(updateProfile({ avatar: dataUrl }));
      dispatch(pushToast({ message: 'Profile photo updated' }));
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    dispatch(updateProfile({ name, address, genres, avatar: avatarPreview || user.avatar }));
    dispatch(pushToast({ message: 'Profile saved' }));
  };

  const displayUser = { ...user, avatar: avatarPreview || user.avatar, name };

  return (
    <div className="container page-enter" style={{ padding: '36px 0', maxWidth: 560 }}>
      <h1 className="serif" style={{ textAlign: 'center', marginBottom: 28, fontSize: '2.2rem' }}>Profile</h1>

      <div className="card" style={{ padding: 24, marginBottom: 16, textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 96, height: 96, margin: '0 auto 16px' }}>
          <Avatar user={displayUser} size={96} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '2px solid var(--card)',
              background: 'var(--primary)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
            }}
            aria-label="Change photo"
          >
            <Camera size={16} />
          </button>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onAvatar} />
        </div>
        <strong style={{ fontSize: '1.2rem', display: 'block' }}>{user.name}</strong>
        <div style={{ color: 'var(--muted)', marginBottom: 8 }}>{user.email}</div>
        {user.role === 'admin' && <span className="chip chip-primary">Admin</span>}
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: '12px 0 0' }}>
          Tap the camera to upload a photo. Stored on-device until the avatar API is connected.
        </p>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
        <div>
          <strong style={{ fontSize: '1.4rem', display: 'block' }}>{purchases.filter((o) => o.userId === user.id && o.status === 'paid').length}</strong>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Owned</span>
        </div>
        <div>
          <strong style={{ fontSize: '1.4rem', display: 'block' }}>{loans.filter((l) => l.userId === user.id && l.status === 'active').length}</strong>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Active loans</span>
        </div>
        <div>
          <strong style={{ fontSize: '1.4rem', display: 'block' }}>{loans.filter((l) => l.userId === user.id && l.status === 'returned').length}</strong>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Returned</span>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <label className="label">Full name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="label" style={{ marginTop: 14 }}>Email</label>
        <input className="input" value={user.email} readOnly />
        <button type="button" className="btn btn-outline" style={{ marginTop: 16 }} onClick={save}>
          Save changes
        </button>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-sans)', margin: '0 0 14px' }}>Genre preferences</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              className={`chip ${genres.includes(g) ? 'chip-primary' : ''}`}
              style={{ cursor: 'pointer', border: 'none' }}
              onClick={() => setGenres((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]))}
            >
              {g}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={save}>
          Save preferences
        </button>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-sans)', margin: '0 0 12px' }}>Delivery address</h3>
        <input
          className="input"
          placeholder="Estate, road, Nairobi…"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={save}>
          Save address
        </button>
      </div>

      <div className="card" style={{ padding: 8 }}>
        <Link to="/shelf?tab=wishlist" style={{ display: 'block', padding: 14, fontWeight: 600 }}>
          Wishlist ({wishCount}) →
        </Link>
        <Link to="/shelf" style={{ display: 'block', padding: 14, fontWeight: 600 }}>My Shelf →</Link>
        {user.role === 'admin' && (
          <Link to="/admin" style={{ display: 'block', padding: 14, fontWeight: 600, color: 'var(--primary)' }}>
            Admin console →
          </Link>
        )}
        <button
          type="button"
          onClick={() => { dispatch(logout()); navigate('/'); }}
          style={{
            display: 'block', width: '100%', textAlign: 'left', padding: 14,
            border: 'none', background: 'none', fontWeight: 600, color: 'var(--danger)', cursor: 'pointer',
          }}
        >
          Sign out →
        </button>
      </div>
    </div>
  );
}
