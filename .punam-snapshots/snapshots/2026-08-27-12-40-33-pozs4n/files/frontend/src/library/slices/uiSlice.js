import { createSlice } from '@reduxjs/toolkit';
import { load, save } from '../helpers/storage.js';
const slice=createSlice({name:'ui',initialState:{theme:load('bk-theme','light'),toasts:[]},reducers:{
  toggleTheme(s){s.theme=s.theme==='light'?'dark':'light';save('bk-theme',s.theme);if(typeof document!=='undefined')document.documentElement.setAttribute('data-theme',s.theme)},
  setTheme(s,a){s.theme=a.payload;save('bk-theme',s.theme);if(typeof document!=='undefined')document.documentElement.setAttribute('data-theme',s.theme)},
  pushToast(s,a){s.toasts.push({id:`t-${Date.now()}`,...a.payload})},
  dismissToast(s,a){s.toasts=s.toasts.filter(t=>t.id!==a.payload)},
}});
export const {toggleTheme,setTheme,pushToast,dismissToast}=slice.actions;export default slice.reducer;
