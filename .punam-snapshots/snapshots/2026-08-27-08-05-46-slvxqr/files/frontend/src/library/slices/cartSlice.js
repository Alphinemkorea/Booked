import { createSlice } from '@reduxjs/toolkit';
import { load, save } from '../helpers/storage.js';
const slice=createSlice({name:'cart',initialState:{purchase:load('bk-pcart',[]),lending:load('bk-lcart',[]),drawer:null},reducers:{
  openDrawer(s,a){s.drawer=a.payload},closeDrawer(s){s.drawer=null},
  addPurchase(s,a){const ex=s.purchase.find(x=>x.bookId===a.payload.bookId);if(ex)ex.qty+=(a.payload.qty||1);else s.purchase.push({...a.payload,qty:a.payload.qty||1});save('bk-pcart',s.purchase)},
  setPurchaseQty(s,a){s.purchase=s.purchase.map(x=>x.bookId===a.payload.bookId?{...x,qty:Math.max(1,a.payload.qty)}:x).filter(x=>x.qty>0);save('bk-pcart',s.purchase)},
  removePurchase(s,a){s.purchase=s.purchase.filter(x=>x.bookId!==a.payload);save('bk-pcart',s.purchase)},
  clearPurchase(s){s.purchase=[];save('bk-pcart',s.purchase)},
  addLending(s,a){if(!s.lending.some(x=>x.bookId===a.payload.bookId)){s.lending.push(a.payload);save('bk-lcart',s.lending)}},
  setLendingDays(s,a){const i=s.lending.find(x=>x.bookId===a.payload.bookId);if(i)i.duration=a.payload.duration;save('bk-lcart',s.lending)},
  removeLending(s,a){s.lending=s.lending.filter(x=>x.bookId!==a.payload);save('bk-lcart',s.lending)},
  clearLending(s){s.lending=[];save('bk-lcart',s.lending)},
}});
export const {openDrawer,closeDrawer,addPurchase,setPurchaseQty,removePurchase,clearPurchase,addLending,setLendingDays,removeLending,clearLending}=slice.actions;export default slice.reducer;
