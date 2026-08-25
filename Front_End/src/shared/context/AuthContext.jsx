import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { currentUser as dummyUser } from '../../data/user';

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
      const rawUser = data.user || data.data?.user;
      const token = data.token || data.accessToken || data.data?.token;
      const displayName = rawUser?.name || rawUser?.fullName || credentials.email.split('@')[0];
      const loggedInUser = { ...dummyUser, ...rawUser, name: displayName, fullName: displayName, email: credentials.email };

      if (token) {
        window.localStorage.setItem('healmind_token', token);
      }
      const fullUserData = { ...loggedInUser, token };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fullUserData));
      setUser(fullUserData);
      return fullUserData;
    } catch (err) {
      if (err.response) {
        const errorList = err.response.data?.errors;
        const msg = Array.isArray(errorList) && errorList.length > 0 
          ? errorList.join(' • ') 
          : (err.response.data?.message || 'Invalid credentials or request error.');
        throw new Error(msg);
      }
      // Offline fallback only when backend server is unreached
      console.warn('Backend server unreached, using offline fallback session:', err.message);
      const fallbackName = credentials.email.split('@')[0];
      const loggedInUser = { ...dummyUser, fullName: fallbackName, name: fallbackName, email: credentials.email };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const endpoint = formData.role === 'doctor' ? '/auth/register/doctor' : '/auth/register/patient';
      const response = await api.post(endpoint, formData);
      const data = response.data;
      const rawUser = data.user || data.data?.user;
      const token = data.token || data.accessToken || data.data?.token;
      const displayName = rawUser?.name || rawUser?.fullName || formData.fullName || formData.name;
      const newUser = { ...dummyUser, ...formData, ...rawUser, name: displayName, fullName: displayName };

      if (token) {
        window.localStorage.setItem('healmind_token', token);
      }
      const fullUserData = { ...newUser, token };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fullUserData));
      setUser(fullUserData);
      return fullUserData;
    } catch (err) {
      if (err.response) {
        const errorList = err.response.data?.errors;
        const msg = Array.isArray(errorList) && errorList.length > 0 
          ? errorList.join(' • ') 
          : (err.response.data?.message || 'Registration failed. Please check input values.');
        throw new Error(msg);
      }
      console.warn('Backend server unreached, using offline fallback registration:', err.message);
      const newUser = { ...dummyUser, ...formData };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem('healmind_token');
    window.sessionStorage.removeItem('healmind_admin_token');
    setUser(null);
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
