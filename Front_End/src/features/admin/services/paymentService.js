import { MOCK_PAYMENTS } from '../constants/mockData'
import { simulateLatency } from './apiClient'

const payments = [...MOCK_PAYMENTS]

export const paymentService = {
  async getAll() {
    return simulateLatency([...payments])
  },

  async getById(paymentId) {
    return simulateLatency(payments.find((payment) => payment.id === paymentId) ?? null)
  },

  async getSummary() {
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
    const monthlyRevenue = payments
      .filter((p) => new Date(p.paymentDate).getMonth() === new Date().getMonth())
      .reduce((sum, p) => sum + p.amount, 0)
    return simulateLatency({ totalRevenue, monthlyRevenue })
  },
}
