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

  /** Assign a doctor to a community access ticket.
   *  TODO: Replace with a real API call when the backend endpoint is ready. */
  async assignDoctor(ticketId, doctorId) {
    return this.update(ticketId, {
      doctorId,
      status: 'under_evaluation',
      updatedAt: new Date().toISOString(),
    })
  },
}
