import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  let token = null;

  try {
    const stored = window.localStorage.getItem('healmind_auth_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      token = parsed?.token || parsed?.accessToken || parsed?.jwt;
    }
  } catch {
    // Ignore JSON parse errors
  }

  if (!token) {
    token =
      window.localStorage.getItem('healmind_token') ||
      window.localStorage.getItem('token') ||
      window.sessionStorage.getItem('healmind_admin_token') ||
      window.sessionStorage.getItem('token');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.localStorage.removeItem('healmind_token');
      window.localStorage.removeItem('healmind_auth_user');
      window.sessionStorage.removeItem('healmind_admin_token');
    }
    return Promise.reject(error);
  }
);

export default api;
