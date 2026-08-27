import { createSlice } from '@reduxjs/toolkit';
import { load, save } from '../helpers/storage.js';
import { HAS_API } from '../config.js';

const slice = createSlice({
  name: 'orders',
  initialState: {
    purchases: load('bk-orders', []),
    loans: load('bk-loans', []),
    status: 'idle',
    error: null,
  },
  reducers: {
    addPurchaseOrder(s, a) {
      const exists = s.purchases.some((o) => o.id === a.payload.id);
      if (!exists) s.purchases.unshift(a.payload);
      else s.purchases = s.purchases.map((o) => (o.id === a.payload.id ? { ...o, ...a.payload } : o));
      if (!HAS_API) save('bk-orders', s.purchases);
    },
    setPurchaseStatus(s, a) {
      const o = s.purchases.find((x) => x.id === a.payload.id);
      if (o) {
        o.status = a.payload.status;
        if (a.payload.patch) Object.assign(o, a.payload.patch);
        if (!HAS_API) save('bk-orders', s.purchases);
      }
    },
    setPurchases(s, a) {
      s.purchases = a.payload || [];
      s.status = 'succeeded';
    },
    addLoan(s, a) {
      const exists = s.loans.some((o) => o.id === a.payload.id);
      if (!exists) s.loans.unshift(a.payload);
      else s.loans = s.loans.map((o) => (o.id === a.payload.id ? { ...o, ...a.payload } : o));
      if (!HAS_API) save('bk-loans', s.loans);
    },
    setLoanStatus(s, a) {
      const l = s.loans.find((x) => x.id === a.payload.id);
      if (l) {
        l.status = a.payload.status;
        if (a.payload.patch) Object.assign(l, a.payload.patch);
        if (!HAS_API) save('bk-loans', s.loans);
      }
    },
    setLoans(s, a) {
      s.loans = a.payload || [];
      s.status = 'succeeded';
    },
  },
});

export const {
  addPurchaseOrder,
  setPurchaseStatus,
  setPurchases,
  addLoan,
  setLoanStatus,
  setLoans,
} = slice.actions;
export default slice.reducer;
