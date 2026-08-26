import { createSlice } from '@reduxjs/toolkit';
const slice = createSlice({
  name: 'books',
  initialState: { items: [], mode: 'shop' },
  reducers: {
    setMode(s, a) { s.mode = a.payload; },
  },
});
export const { setMode } = slice.actions;
export default slice.reducer;
