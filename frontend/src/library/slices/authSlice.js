import { createSlice } from '@reduxjs/toolkit';
import { load, save } from '../helpers/storage.js';
<<<<<<< HEAD
const UK='bk-users', SK='bk-session';
const defaults=[{id:'admin1',email:'admin@booked.ke',password:'admin123',name:'Admin User',role:'admin',genres:[],address:''},{id:'u1',email:'amara@example.com',password:'user123',name:'Amara Wanjiku',role:'user',genres:['Fiction'],address:'Kilimani, Nairobi'}];
function getUsers(){return load(UK,defaults)}
function persist(u){save(UK,u)}
const slice=createSlice({name:'auth',initialState:{user:load(SK,null),users:getUsers()},reducers:{
  loginSuccess(s,a){s.user=a.payload;save(SK,a.payload)},
  logout(s){s.user=null;save(SK,null)},
  registerSuccess(s,a){s.users.push(a.payload.account);persist(s.users);s.user=a.payload.session;save(SK,a.payload.session)},
  updateProfile(s,a){if(!s.user)return;s.user={...s.user,...a.payload};save(SK,s.user);s.users=s.users.map(u=>u.id===s.user.id?{...u,...a.payload,password:u.password}:u);persist(s.users)},
}});
export const {loginSuccess,logout,registerSuccess,updateProfile}=slice.actions;
export default slice.reducer;
export function attemptLogin(email,password){const u=getUsers().find(x=>x.email.toLowerCase()===String(email).toLowerCase().trim()&&x.password===password);if(!u)return{ok:false,error:'Invalid email or password.'};const{password:_,...session}=u;return{ok:true,user:session}}
export function attemptRegister({name,email,password}){const users=getUsers();if(users.some(u=>u.email.toLowerCase()===email.toLowerCase().trim()))return{ok:false,error:'An account with this email already exists. Sign in instead.'};const account={id:`u-${Date.now().toString(36)}`,email:email.trim().toLowerCase(),password,name:name.trim(),role:'user',genres:[],address:''};const{password:_,...session}=account;return{ok:true,account,session}}
=======

const UK = 'bk-users';
const SK = 'bk-session';

const defaults = [
  {
    id: 'admin1',
    email: 'admin@booked.ke',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    genres: [],
    address: '',
  },
  {
    id: 'u1',
    email: 'amara@example.com',
    password: 'user123',
    name: 'Amara Wanjiku',
    role: 'user',
    genres: ['Fiction'],
    address: 'Kilimani, Nairobi',
  },
];

function getUsers() {
  return load(UK, defaults);
}
function persist(u) {
  save(UK, u);
}

function stripPassword(u) {
  const { password, ...session } = u;
  return session;
}

const slice = createSlice({
  name: 'auth',
  initialState: {
    user: load(SK, null),
    users: getUsers(),
  },
  reducers: {
    loginSuccess(s, a) {
      s.user = a.payload;
      save(SK, a.payload);
    },
    logout(s) {
      s.user = null;
      save(SK, null);
    },
    registerSuccess(s, a) {
      s.users.push(a.payload.account);
      persist(s.users);
      s.user = a.payload.session;
      save(SK, a.payload.session);
    },
    updateProfile(s, a) {
      if (!s.user) return;
      s.user = { ...s.user, ...a.payload };
      save(SK, s.user);
      s.users = s.users.map((u) =>
        u.id === s.user.id ? { ...u, ...a.payload, password: u.password } : u
      );
      persist(s.users);
    },
    /** Admin: sync users list from storage after external mutation helpers */
    setUsers(s, a) {
      s.users = a.payload;
      persist(s.users);
      // Keep session in sync if current user was edited
      if (s.user) {
        const me = s.users.find((u) => u.id === s.user.id);
        if (me) {
          s.user = stripPassword(me);
          save(SK, s.user);
        }
      }
    },
  },
});

export const { loginSuccess, logout, registerSuccess, updateProfile, setUsers } = slice.actions;
export default slice.reducer;

export function attemptLogin(email, password) {
  const u = getUsers().find(
    (x) =>
      x.email.toLowerCase() === String(email).toLowerCase().trim() &&
      x.password === password
  );
  if (!u) return { ok: false, error: 'Invalid email or password.' };
  return { ok: true, user: stripPassword(u) };
}

/** Admin-only login — rejects non-admin accounts */
export function attemptAdminLogin(email, password) {
  const res = attemptLogin(email, password);
  if (!res.ok) return res;
  if (res.user.role !== 'admin') {
    return { ok: false, error: 'This account is not an administrator.' };
  }
  return res;
}

export function attemptRegister({ name, email, password }) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase().trim())) {
    return { ok: false, error: 'An account with this email already exists. Sign in instead.' };
  }
  const account = {
    id: `u-${Date.now().toString(36)}`,
    email: email.trim().toLowerCase(),
    password,
    name: name.trim(),
    role: 'user',
    genres: [],
    address: '',
  };
  return { ok: true, account, session: stripPassword(account) };
}

// ——— Admin user management helpers (return new users array; dispatch setUsers) ———

export function adminListUsers() {
  return getUsers().map((u) => stripPassword(u));
}

export function adminAddUser({ name, email, password, role = 'user' }) {
  const users = getUsers();
  const em = String(email || '')
    .trim()
    .toLowerCase();
  if (!name || name.trim().length < 2) return { ok: false, error: 'Name is required (min 2 characters).' };
  if (!em || !em.includes('@')) return { ok: false, error: 'Valid email is required.' };
  if (!password || password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };
  if (users.some((u) => u.email.toLowerCase() === em)) {
    return { ok: false, error: 'A user with this email already exists.' };
  }
  const account = {
    id: `u-${Date.now().toString(36)}`,
    email: em,
    password,
    name: name.trim(),
    role: role === 'admin' ? 'admin' : 'user',
    genres: [],
    address: '',
  };
  const next = [...users, account];
  persist(next);
  return { ok: true, users: next.map(stripPassword), account: stripPassword(account) };
}

export function adminDeleteUser(userId, currentAdminId) {
  const users = getUsers();
  if (userId === currentAdminId) {
    return { ok: false, error: 'You cannot delete your own account while signed in.' };
  }
  const target = users.find((u) => u.id === userId);
  if (!target) return { ok: false, error: 'User not found.' };
  const admins = users.filter((u) => u.role === 'admin');
  if (target.role === 'admin' && admins.length <= 1) {
    return { ok: false, error: 'Cannot delete the last admin account.' };
  }
  const next = users.filter((u) => u.id !== userId);
  persist(next);
  return { ok: true, users: next.map(stripPassword) };
}

export function adminSetRole(userId, role, currentAdminId) {
  const users = getUsers();
  const target = users.find((u) => u.id === userId);
  if (!target) return { ok: false, error: 'User not found.' };
  if (role !== 'admin' && role !== 'user') {
    return { ok: false, error: 'Invalid role.' };
  }
  if (userId === currentAdminId && role !== 'admin') {
    return { ok: false, error: 'You cannot revoke your own admin status.' };
  }
  const admins = users.filter((u) => u.role === 'admin');
  if (target.role === 'admin' && role === 'user' && admins.length <= 1) {
    return { ok: false, error: 'Cannot revoke the last admin.' };
  }
  const next = users.map((u) => (u.id === userId ? { ...u, role } : u));
  persist(next);
  return { ok: true, users: next.map(stripPassword) };
}
>>>>>>> origin/develop
