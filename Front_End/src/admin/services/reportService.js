import { MOCK_DOCTORS, MOCK_PATIENTS, MOCK_PAYMENTS, MOCK_SESSIONS } from '../constants/mockData'
import { simulateLatency } from './apiClient'

export const reportService = {
  async getOverview() {
    return simulateLatency({
      doctors: MOCK_DOCTORS.length,
      patients: MOCK_PATIENTS.length,
      sessions: MOCK_SESSIONS.length,
      revenue: MOCK_PAYMENTS.reduce((sum, p) => sum + p.amount, 0),
    })
  },

  /**
   * Simulates generating a downloadable report. In production this should
   * call the backend endpoint and stream back a file (csv/xlsx/pdf).
   */
  async exportReport(reportType, format) {
    return simulateLatency({ reportType, format, generatedAt: new Date().toISOString(), url: '#' }, 800)
  },
}
