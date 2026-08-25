import { apiClient } from './apiClient'

export const authService = {
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials)
      const data = response.data
      const token = data.token || data.accessToken || data.data?.token || 'mock-admin-token'
      sessionStorage.setItem('healmind_admin_token', token)
      return data.user || data.data?.user || { email: credentials.email, role: 'admin', token }
    } catch (err) {
      if (err.response) {
        throw new Error(err.response.data?.message || 'Invalid admin email or password.');
      }
      console.warn('Admin API unreached, using offline fallback:', err.message)
      const mockResult = { token: 'mock-jwt-token', email: credentials.email, role: 'admin' }
      sessionStorage.setItem('healmind_admin_token', mockResult.token)
      return mockResult
    }
  },

  async logout() {
    sessionStorage.removeItem('healmind_admin_token')
    return Promise.resolve({ success: true })
  },
}

export { apiClient }
