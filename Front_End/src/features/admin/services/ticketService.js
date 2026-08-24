import { MOCK_TICKETS } from '../constants/mockData'
import { simulateLatency } from './apiClient'

let tickets = [...MOCK_TICKETS]

export const ticketService = {
  async getAll() {
    return simulateLatency([...tickets])
  },

  async getById(ticketId) {
    return simulateLatency(tickets.find((ticket) => ticket.id === ticketId) ?? null)
  },

  async update(ticketId, payload) {
    tickets = tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, ...payload } : ticket))
    return simulateLatency(tickets.find((ticket) => ticket.id === ticketId))
  },

  // TODO: replace with real API call when backend endpoint is ready, e.g.:
  // async assignDoctor(ticketId, doctorId) {
  //   return apiClient.patch(`/tickets/${ticketId}/assign`, { doctorId }).then((res) => res.data)
  // }
  async assignDoctor(ticketId, doctorId) {
    return this.update(ticketId, { doctorId })
  },
}
