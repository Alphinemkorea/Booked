import { createSlice } from '@reduxjs/toolkit';
import { load, save } from '../helpers/storage.js';
const slice=createSlice({name:'wishlist',initialState:{ids:load('bk-wish',[])},reducers:{
  toggleWish(s,a){s.ids=s.ids.includes(a.payload)?s.ids.filter(x=>x!==a.payload):[...s.ids,a.payload];save('bk-wish',s.ids)},
}});
export const {toggleWish}=slice.actions;export default slice.reducer;
