import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice.js';
import books from './slices/booksSlice.js';
import cart from './slices/cartSlice.js';
import orders from './slices/ordersSlice.js';
import wishlist from './slices/wishlistSlice.js';
import ui from './slices/uiSlice.js';
export const store = configureStore({
  reducer: { auth, books, cart, orders, wishlist, ui },
});
