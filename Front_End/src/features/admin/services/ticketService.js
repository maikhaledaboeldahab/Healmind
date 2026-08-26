import { MOCK_TICKETS } from '../constants/mockData'
import { apiClient, simulateLatency } from './apiClient'

let tickets = [...MOCK_TICKETS]

export const ticketService = {
  async getAll() {
    try {
      const res = await apiClient.get('/ticket/admin/pending')
      const raw = res.data?.data || res.data?.tickets || res.data
      return Array.isArray(raw) ? raw : tickets
    } catch {
      return simulateLatency([...tickets])
    }
  },

  async getById(ticketId) {
    try {
      const res = await apiClient.get(`/ticket/${ticketId}`)
      return res.data?.data || res.data || (tickets.find((ticket) => ticket.id === ticketId) ?? null)
    } catch {
      return simulateLatency(tickets.find((ticket) => ticket.id === ticketId) ?? null)
    }
  },

  async update(ticketId, payload) {
    try {
      const res = await apiClient.patch(`/ticket/${ticketId}`, payload)
      return res.data?.data || res.data
    } catch {
      tickets = tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, ...payload } : ticket))
      return simulateLatency(tickets.find((ticket) => ticket.id === ticketId))
    }
  },

  async assignDoctor(ticketId, doctorId) {
    try {
      const res = await apiClient.patch(`/ticket/admin/${ticketId}/assign`, { doctorId })
      return res.data?.data || res.data
    } catch {
      return this.update(ticketId, {
        doctorId,
        status: 'under_evaluation',
        updatedAt: new Date().toISOString(),
      })
    }
  },
}
