import { createSlice } from '@reduxjs/toolkit';
const slice = createSlice({
  name: 'cart',
  initialState: { purchase: [], lending: [], drawer: null },
  reducers: {
    openDrawer(s, a) { s.drawer = a.payload; },
    closeDrawer(s) { s.drawer = null; },
  },
});
export const { openDrawer, closeDrawer } = slice.actions;
export default slice.reducer;
