import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // If sending FormData (e.g. file uploads), allow axios/browser to set boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  let token = window.localStorage.getItem('healmind_token');

  if (!token) {
    try {
      const stored = window.localStorage.getItem('healmind_auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        token = parsed?.token || parsed?.accessToken || parsed?.jwt;
      }
    } catch {
      // Ignore JSON parse errors
    }
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
    }
    return Promise.reject(error);
  }
);

export { api, api as apiClient };
export default api;
