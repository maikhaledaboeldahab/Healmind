import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.healmind.example.com',
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

export default api;
