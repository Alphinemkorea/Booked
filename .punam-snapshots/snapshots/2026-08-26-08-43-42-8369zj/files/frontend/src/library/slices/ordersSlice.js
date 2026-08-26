import { createSlice } from '@reduxjs/toolkit';
const slice = createSlice({
  name: 'orders',
  initialState: { purchases: [], loans: [] },
  reducers: {},
});
export default slice.reducer;
