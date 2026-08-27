import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar.jsx';
import { SiteFooter } from './components/layout/SiteFooter.jsx';
import { BottomTabBar } from './components/layout/BottomTabBar.jsx';
import { ErrorBoundary } from './components/layout/ErrorBoundary.jsx';
import { RouteEffects } from './components/layout/RouteEffects.jsx';
import { ToastStack } from './components/shared/ToastStack.jsx';
import { CartDrawer } from './components/shared/CartDrawer.jsx';
import { HomePage } from './components/page/HomePage.jsx';
import { ShopPage } from './components/page/ShopPage.jsx';
import { LibraryPage } from './components/page/LibraryPage.jsx';
import { BookDetailPage } from './components/page/BookDetailPage.jsx';
import { SearchPage } from './components/page/SearchPage.jsx';
<<<<<<< HEAD
=======
import { CartPage } from './components/page/CartPage.jsx';
>>>>>>> fd34775763874bd90ed505782f080973551b04de
import { CheckoutPage } from './components/page/CheckoutPage.jsx';
import { ShelfPage } from './components/page/ShelfPage.jsx';
import { ProfilePage } from './components/page/ProfilePage.jsx';
import { LoginPage } from './components/page/LoginPage.jsx';
import { RegisterPage } from './components/page/RegisterPage.jsx';
import { AdminDashboard } from './components/page/AdminDashboard.jsx';
import { AdminOverview } from './components/page/AdminOverview.jsx';
import { AdminBooks } from './components/page/AdminBooks.jsx';
import { AdminOrders } from './components/page/AdminOrders.jsx';
import { AdminLending } from './components/page/AdminLending.jsx';
import { ReaderPage } from './components/page/ReaderPage.jsx';

function Shell({ children, bare = false }) {
  return (
    <>
      {!bare && <Navbar />}
      <ErrorBoundary>
        <main className="app-main">{children}</main>
      </ErrorBoundary>
      {!bare && <SiteFooter />}
      {!bare && <BottomTabBar />}
      <CartDrawer />
      <ToastStack />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteEffects />
      <Routes>
        <Route path="/read/:bookId" element={<Shell bare><ReaderPage /></Shell>} />
        <Route path="/login" element={<Shell bare><LoginPage /></Shell>} />
        <Route path="/register" element={<Shell bare><RegisterPage /></Shell>} />
        <Route path="/" element={<Shell><HomePage /></Shell>} />
        <Route path="/shop" element={<Shell><ShopPage /></Shell>} />
        <Route path="/library" element={<Shell><LibraryPage /></Shell>} />
        <Route path="/book/:id" element={<Shell><BookDetailPage /></Shell>} />
        <Route path="/search" element={<Shell><SearchPage /></Shell>} />
<<<<<<< HEAD
=======
        <Route path="/cart" element={<Shell><CartPage /></Shell>} />
>>>>>>> fd34775763874bd90ed505782f080973551b04de
        <Route path="/checkout/:type" element={<Shell><CheckoutPage /></Shell>} />
        <Route path="/shelf" element={<Shell><ShelfPage /></Shell>} />
        <Route path="/profile" element={<Shell><ProfilePage /></Shell>} />
        <Route path="/admin" element={<Shell bare><AdminDashboard /></Shell>}>
          <Route index element={<AdminOverview />} />
          <Route path="books" element={<AdminBooks />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="lending" element={<AdminLending />} />
        </Route>
        <Route path="*" element={<Shell><Navigate to="/" replace /></Shell>} />
      </Routes>
    </BrowserRouter>
  );
}
