import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.healmind.example.com/admin'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('healmind_admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('healmind_admin_token')
    }
    return Promise.reject(error)
  },
)

/**
 * Simulates network latency for mock service calls so loading states
 * (spinners, skeletons) behave the same as they will against a real API.
 */
export function simulateLatency(data, ms = 450) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}
