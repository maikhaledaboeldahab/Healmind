import { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

const AuthContext = createContext(null);

const STORAGE_KEY = 'healmind_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      const data = response.data;
      const rawUser = data.user || data.data?.user || data;
      const token = data.token || data.accessToken || data.data?.token;

      if (!token) {
        throw new Error('Authentication error: No token received from server.');
      }

      window.localStorage.setItem('healmind_token', token);
      connectSocket(token);
      const displayName = rawUser?.name || rawUser?.fullName || credentials.email.split('@')[0];
      const fullUserData = { ...rawUser, name: displayName, fullName: displayName, email: rawUser.email || credentials.email, token };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fullUserData));
      setUser(fullUserData);
      return fullUserData;
    } catch (err) {
      const errorList = err.response?.data?.errors;
      const msg = Array.isArray(errorList) && errorList.length > 0 
        ? errorList.join(' • ') 
        : (err.response?.data?.message || err.message || 'Login failed.');
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const isDoctor = formData instanceof FormData 
        ? formData.get('role') === 'doctor' 
        : formData.role === 'doctor';
      const endpoint = isDoctor ? '/auth/register/doctor' : '/auth/register/patient';
      const response = await api.post(endpoint, formData);
      const data = response.data;
      const rawUser = data.user || data.data?.user || data;
      const token = data.token || data.accessToken || data.data?.token;

      if (token) {
        window.localStorage.setItem('healmind_token', token);
        connectSocket(token);
      }
      const displayName = rawUser?.name || rawUser?.fullName || (formData instanceof FormData ? formData.get('name') : formData.name);
      const fullUserData = { ...rawUser, name: displayName, fullName: displayName, token };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fullUserData));
      setUser(fullUserData);
      return fullUserData;
    } catch (err) {
      const errorList = err.response?.data?.errors;
      const msg = Array.isArray(errorList) && errorList.length > 0 
        ? errorList.join(' • ') 
        : (err.response?.data?.message || err.message || 'Registration failed.');
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      disconnectSocket();
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem('healmind_token');
      setUser(null);
    }
  };

  const updateProfile = (partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
