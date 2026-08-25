import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSucceeded, authFailed, authLoggedOut, updateUser } from '../store/slices/authSlice';
import { authService } from '../features/auth/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    (async () => {
      const user = await authService.getSession();
      if (user) {
        dispatch(authSucceeded({ user }));
      }
      setBootstrapped(true);
    })();
  }, [dispatch]);

  const login = useCallback(async (credentials) => {
    dispatch(authStart());
    try {
      const { user, orgStatus } = await authService.login(credentials);
      dispatch(authSucceeded({ user, orgStatus }));
      return { user, orgStatus };
    } catch (err) {
      dispatch(authFailed(err.message));
      throw err;
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    await authService.logout();
    dispatch(authLoggedOut());
  }, [dispatch]);

  const patchUser = useCallback((patch) => {
    dispatch(updateUser(patch));
  }, [dispatch]);

  return (
    <AuthContext.Provider value={{ ...auth, bootstrapped, login, logout, updateUser: patchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
