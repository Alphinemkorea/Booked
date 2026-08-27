import { useAppDispatch, useAppSelector } from '../storeHooks.js';
import { login as loginAction, logout as logoutAction, register as registerAction } from '../slices/authSlice.js';

export function useAuth() {
  const user = useAppSelector((s) => s.auth.user);
  const status = useAppSelector((s) => s.auth.status);
  const dispatch = useAppDispatch();
  return {
    user,
    status,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    login: (payload) => dispatch(loginAction(payload)),
    register: (payload) => dispatch(registerAction(payload)),
    logout: () => dispatch(logoutAction()),
  };
}
