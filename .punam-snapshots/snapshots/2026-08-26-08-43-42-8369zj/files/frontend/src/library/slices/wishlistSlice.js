import { createSlice } from '@reduxjs/toolkit';
const slice = createSlice({
  name: 'wishlist',
  initialState: { ids: [] },
  reducers: {
    toggleWish(s, a) {
      const id = a.payload;
      s.ids = s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id];
    },
  },
});
export const { toggleWish } = slice.actions;
export default slice.reducer;
