import { apiClient } from './apiClient'

export const authService = {
  /**
   * Replace with a real call once the backend is available:
   * return apiClient.post('/auth/login', { email, password }).then((res) => res.data)
   */
  async login(credentials) {
    return Promise.resolve({ token: 'mock-jwt-token', ...credentials })
  },

  async logout() {
    return Promise.resolve({ success: true })
  },
}

export { apiClient }
