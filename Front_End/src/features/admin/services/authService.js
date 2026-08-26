import { apiClient } from './apiClient';

export const authService = {
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const data = response.data;
      const user = data.user || data.data?.user;
      const token = data.token || data.accessToken || data.data?.token;

      if (!token) {
        throw new Error('Authentication failed: No token received.');
      }

      window.localStorage.setItem('healmind_token', token);
      const userData = { ...user, token };
      window.localStorage.setItem('healmind_auth_user', JSON.stringify(userData));

      return userData;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors) ? err.response.data.errors.join(' • ') : null) ||
        err.message ||
        'Admin login failed.';
      throw new Error(errorMsg);
    }
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      window.localStorage.removeItem('healmind_token');
      window.localStorage.removeItem('healmind_auth_user');
    }
    return { success: true };
  },
};

export { apiClient };
export default authService;
