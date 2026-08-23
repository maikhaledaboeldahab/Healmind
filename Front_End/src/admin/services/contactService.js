import { MOCK_CONTACTS } from '../constants/mockData'
import { apiClient, simulateLatency } from './apiClient'

let contacts = [...MOCK_CONTACTS]

export const contactService = {
  async getAll() {
    try {
      const response = await apiClient.get('/contact')
      if (response.data) {
        return response.data
      }
    } catch {
      // If backend endpoint is missing/offline, fall back to simulated dataset
    }
    return simulateLatency([...contacts])
  },

  async getById(contactId) {
    try {
      const response = await apiClient.get(`/contact/${contactId}`)
      if (response.data) {
        return response.data
      }
    } catch {
      // Fall back to local
    }
    return simulateLatency(contacts.find((c) => c.id === contactId) ?? null)
  },

  async markAsRead(contactId) {
    try {
      const response = await apiClient.patch(`/contact/${contactId}/read`)
      if (response.data) {
        return response.data
      }
    } catch {
      // Backend mark-as-read endpoint might not exist yet; handle locally in state
    }
    contacts = contacts.map((c) =>
      c.id === contactId ? { ...c, isRead: true, updatedAt: new Date().toISOString() } : c,
    )
    return simulateLatency(contacts.find((c) => c.id === contactId))
  },
}
