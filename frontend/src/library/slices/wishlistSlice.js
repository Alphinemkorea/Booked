import { createSlice } from '@reduxjs/toolkit';
const s = createSlice({
  name: 'wishlist',
  initialState: {ids:[]},
  reducers: {
    setMode(st,a){ if('mode' in st) st.mode=a.payload; },
    openDrawer(st,a){ if('drawer' in st) st.drawer=a.payload; },
    closeDrawer(st){ if('drawer' in st) st.drawer=null; },
    toggleWish(st,a){ if(!st.ids)return; const id=a.payload; st.ids=st.ids.includes(id)?st.ids.filter(x=>x!==id):[...st.ids,id]; },
  },
});
export const { setMode, openDrawer, closeDrawer, toggleWish } = s.actions;
export default s.reducer;
