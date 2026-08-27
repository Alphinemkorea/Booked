import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../../library/storeHooks.js';

export function ProtectedRoute({ children, adminOnly = false }) {
  const user = useAppSelector((s) => s.auth.user);
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}
