import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import { updateProfile, logout } from '../../library/slices/authSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { GENRES } from '../../library/json/booksData.js';
import { Avatar } from '../shared/Avatar.jsx';
import styles from '../../styles/components/page/ProfilePage.module.css';
import { cn } from '../../library/helpers/cn.js';

export function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user);
  const purchases = useAppSelector((s) => s.orders.purchases) || [];
  const loans = useAppSelector((s) => s.orders.loans) || [];
  const dispatch = useAppDispatch();
  const [name, setName] = useState(user?.name || '');
  const [genres, setGenres] = useState(user?.genres || []);

  if (!user) return <Navigate to="/login" replace />;

  const owned = purchases.filter((o) => o.userId === user.id && o.status === 'paid').length;
  const active = loans.filter((l) => l.userId === user.id && l.status === 'active').length;
  const returned = loans.filter((l) => l.userId === user.id && l.status === 'returned').length;

  const toggle = (g) => setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const save = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name, genres }));
    dispatch(pushToast({ message: 'Profile updated', tone: 'success' }));
  };

  return (
    <div className={`container page-enter max-720 ${styles.page}`}>
      <h1 className="serif">Profile</h1>
      <div className={`card ${styles.avatarCard}`}>
        <Avatar
          user={user}
          size={88}
          editable
          onPick={(avatar) => {
            dispatch(updateProfile({ avatar }));
            dispatch(pushToast({ message: 'Photo updated', tone: 'success' }));
          }}
        />
        <p className={styles.hint}>Tap the edit control to upload a photo</p>
        <strong>{user.email}</strong>
      </div>

      <div className={`card ${styles.stats}`}>
        <div>
          <strong className={styles.statValue}>{owned}</strong>
          <span className={styles.statLabel}>Owned</span>
        </div>
        <div>
          <strong className={styles.statValue}>{active}</strong>
          <span className={styles.statLabel}>Active loans</span>
        </div>
        <div>
          <strong className={styles.statValue}>{returned}</strong>
          <span className={styles.statLabel}>Returned</span>
        </div>
      </div>

      <form className={`card ${styles.card}`} onSubmit={save}>
        <label className="label" htmlFor="pname">Full name</label>
        <input id="pname" className="input" value={name} onChange={(e) => setName(e.target.value)} />
        <span className="label">Genres</span>
        <div className={styles.genres}>
          {GENRES.map((g) => (
            <button key={g} type="button" className={cn('chip', genres.includes(g) && 'chip-primary')} onClick={() => toggle(g)}>
              {g}
            </button>
          ))}
        </div>
        <div className={styles.actions}>
          <button type="submit" className="btn btn-primary">Save changes</button>
          <Link to="/shelf" className="btn btn-outline">My Shelf</Link>
          <button type="button" className="btn btn-ghost" onClick={() => dispatch(logout())}>Sign out</button>
        </div>
      </form>
    </div>
  );
}
