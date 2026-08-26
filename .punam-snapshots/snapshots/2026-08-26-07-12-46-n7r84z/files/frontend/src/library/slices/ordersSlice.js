import { createSlice } from '@reduxjs/toolkit';
import { load, save } from '../helpers/storage.js';
const slice=createSlice({name:'orders',initialState:{purchases:load('bk-orders',[]),loans:load('bk-loans',[])},reducers:{
  addPurchaseOrder(s,a){s.purchases.unshift(a.payload);save('bk-orders',s.purchases)},
  setPurchaseStatus(s,a){const o=s.purchases.find(x=>x.id===a.payload.id);if(o){o.status=a.payload.status;if(a.payload.patch)Object.assign(o,a.payload.patch);save('bk-orders',s.purchases)}},
  addLoan(s,a){s.loans.unshift(a.payload);save('bk-loans',s.loans)},
  setLoanStatus(s,a){const l=s.loans.find(x=>x.id===a.payload.id);if(l){l.status=a.payload.status;if(a.payload.patch)Object.assign(l,a.payload.patch);save('bk-loans',s.loans)}},
}});
export const {addPurchaseOrder,setPurchaseStatus,addLoan,setLoanStatus}=slice.actions;export default slice.reducer;
