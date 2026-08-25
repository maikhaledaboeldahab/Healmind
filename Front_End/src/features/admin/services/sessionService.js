import { MOCK_SESSIONS } from '../constants/mockData'
import { SESSION_STATUS } from '../constants/statusEnums'
import { simulateLatency } from './apiClient'

let sessions = [...MOCK_SESSIONS]

export const sessionService = {
  async getAll() {
    return simulateLatency([...sessions])
  },

  async getById(sessionId) {
    return simulateLatency(sessions.find((session) => session.id === sessionId) ?? null)
  },

  async update(sessionId, payload) {
    sessions = sessions.map((session) => (session.id === sessionId ? { ...session, ...payload } : session))
    return simulateLatency(sessions.find((session) => session.id === sessionId))
  },

  async reschedule(sessionId, { startTime, endTime }) {
    return this.update(sessionId, { startTime, endTime, status: SESSION_STATUS.UPCOMING })
  },

  async cancel(sessionId) {
    return this.update(sessionId, { status: SESSION_STATUS.CANCELLED })
  },

  async markCompleted(sessionId) {
    return this.update(sessionId, { status: SESSION_STATUS.COMPLETED })
  },
}
