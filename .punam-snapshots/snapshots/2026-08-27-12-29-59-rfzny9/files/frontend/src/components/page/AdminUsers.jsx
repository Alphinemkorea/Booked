import { useMemo, useState } from 'react';
import { UserPlus, Trash2, Shield, ShieldOff, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../library/storeHooks.js';
import {
  adminAddUser,
  adminDeleteUser,
  adminSetRole,
  setUsers,
} from '../../library/slices/authSlice.js';
import { pushToast } from '../../library/slices/uiSlice.js';
import { load } from '../../library/helpers/storage.js';

const UK = 'bk-users';

function reloadUsers(dispatch) {
  dispatch(setUsers(load(UK, [])));
}

export function AdminUsers() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.user);
  const users = useAppSelector((s) => s.auth.users);
  const [q, setQ] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [formError, setFormError] = useState('');

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const rows = users.map(({ password, ...u }) => u);
    if (!term) return rows;
    return rows.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term)
    );
  }, [users, q]);

  const onAdd = (e) => {
    e.preventDefault();
    setFormError('');
    const res = adminAddUser(form);
    if (!res.ok) {
      setFormError(res.error);
      return;
    }
    reloadUsers(dispatch);
    dispatch(pushToast({ message: `User ${form.name} created`, tone: 'success' }));
    setForm({ name: '', email: '', password: '', role: 'user' });
    setShowForm(false);
  };

  const onDelete = (id, name) => {
    if (!window.confirm(`Delete user “${name}”? This cannot be undone.`)) return;
    const res = adminDeleteUser(id, currentUser?.id);
    if (!res.ok) {
      dispatch(pushToast({ message: res.error, tone: 'error' }));
      return;
    }
    reloadUsers(dispatch);
    dispatch(pushToast({ message: `Deleted ${name}`, tone: 'success' }));
  };

  const onToggleAdmin = (id, name, isAdmin) => {
    const label = isAdmin ? `Revoke admin from “${name}”?` : `Make “${name}” an admin?`;
    if (!window.confirm(label)) return;
    const res = adminSetRole(id, isAdmin ? 'user' : 'admin', currentUser?.id);
    if (!res.ok) {
      dispatch(pushToast({ message: res.error, tone: 'error' }));
      return;
    }
    reloadUsers(dispatch);
    dispatch(
      pushToast({
        message: isAdmin ? `Admin revoked for ${name}` : `${name} is now an admin`,
        tone: 'success',
      })
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 24 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1 className="serif" style={{ margin: 0, fontSize: '1.75rem' }}>
            Manage users
          </h1>
          <p style={{ margin: '6px 0 0', color: 'var(--muted)' }}>
            Add accounts, promote admins, or remove access.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          <UserPlus size={18} /> {showForm ? 'Cancel' : 'Add user'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={onAdd}
          className="card"
          style={{ padding: 20, marginBottom: 24, display: 'grid', gap: 14, maxWidth: 520 }}
        >
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>New user</h2>
          {formError && (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                background: 'var(--danger-soft)',
                color: 'var(--danger)',
                fontWeight: 600,
                fontSize: '0.92rem',
              }}
            >
              {formError}
            </div>
          )}
          <div>
            <label className="label" htmlFor="nu-name">
              Full name
            </label>
            <input
              id="nu-name"
              className="input"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="label" htmlFor="nu-email">
              Email
            </label>
            <input
              id="nu-email"
              className="input"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="label" htmlFor="nu-pass">
              Temporary password
            </label>
            <input
              id="nu-pass"
              className="input"
              type="text"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </div>
          <div>
            <label className="label" htmlFor="nu-role">
              Role
            </label>
            <select
              id="nu-role"
              className="input"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Create user
          </button>
        </form>
      )}

      <div style={{ position: 'relative', marginBottom: 16, maxWidth: 360 }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--muted)',
          }}
        />
        <input
          className="input"
          style={{ paddingLeft: 42 }}
          placeholder="Search name, email, role…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="card" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
              <th style={{ padding: '14px 16px', color: 'var(--muted)', fontWeight: 700 }}>Name</th>
              <th style={{ padding: '14px 16px', color: 'var(--muted)', fontWeight: 700 }}>Email</th>
              <th style={{ padding: '14px 16px', color: 'var(--muted)', fontWeight: 700 }}>Role</th>
              <th style={{ padding: '14px 16px', color: 'var(--muted)', fontWeight: 700 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => {
              const isMe = u.id === currentUser?.id;
              const isAdmin = u.role === 'admin';
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                    {u.name}
                    {isMe && (
                      <span className="chip chip-primary" style={{ marginLeft: 8, fontSize: 11 }}>
                        You
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>{u.email}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`chip ${isAdmin ? 'chip-primary' : ''}`}>{u.role}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        disabled={isMe && isAdmin}
                        title={isAdmin ? 'Revoke admin' : 'Make admin'}
                        onClick={() => onToggleAdmin(u.id, u.name, isAdmin)}
                      >
                        {isAdmin ? <ShieldOff size={16} /> : <Shield size={16} />}
                        {isAdmin ? 'Revoke admin' : 'Make admin'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        disabled={isMe}
                        onClick={() => onDelete(u.id, u.name)}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!list.length && (
              <tr>
                <td colSpan={4} style={{ padding: 28, textAlign: 'center', color: 'var(--muted)' }}>
                  No users match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
