import { createContext, useCallback, useMemo, useState } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem('healmind_token'));
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = window.localStorage.getItem('healmind_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async ({ email, password }) => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        throw new Error('Email and password are required.');
      }
      const user = await authService.login({ email, password });
      setToken(user.token);
      setAdmin(user);
      return user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setToken(null);
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({
      admin,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      logout,
      setAdmin,
    }),
    [admin, token, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
