import { MOCK_TICKETS } from '../constants/mockData'
import { apiClient, simulateLatency } from './apiClient'

let tickets = [...MOCK_TICKETS]

export const ticketService = {
  async getAll() {
    try {
      const res = await apiClient.get('/ticket/all-tickets')
      return res.data?.data || res.data?.tickets || res.data || tickets
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
      const res = await apiClient.put(`/ticket/${ticketId}`, payload)
      return res.data?.data || res.data
    } catch {
      tickets = tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, ...payload } : ticket))
      return simulateLatency(tickets.find((ticket) => ticket.id === ticketId))
    }
  },

  async assignDoctor(ticketId, doctorId) {
    try {
      const res = await apiClient.put(`/ticket/${ticketId}/assign-doctor`, { doctorId })
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
