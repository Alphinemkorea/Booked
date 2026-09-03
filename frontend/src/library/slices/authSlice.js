import { createSlice } from '@reduxjs/toolkit';
import { load, save } from '../helpers/storage.js';
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
