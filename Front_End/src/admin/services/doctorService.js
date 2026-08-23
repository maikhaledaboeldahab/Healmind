import { MOCK_DOCTORS } from '../constants/mockData'
import { DOCTOR_STATUS } from '../constants/statusEnums'
import { simulateLatency } from './apiClient'

// In-memory store simulating a backend. Replace each method body with a
// real apiClient call (see commented examples) once the backend is ready.
let doctors = [...MOCK_DOCTORS]

export const doctorService = {
  async getAll() {
    // return apiClient.get('/doctors').then((res) => res.data)
    return simulateLatency([...doctors])
  },

  async getPendingVerification() {
    return simulateLatency(doctors.filter((doc) => doc.status === DOCTOR_STATUS.PENDING))
  },

  async getById(doctorId) {
    return simulateLatency(doctors.find((doc) => doc.id === doctorId) ?? null)
  },

  async create(payload) {
    const newDoctor = {
      id: `DOC-${String(doctors.length + 1).padStart(4, '0')}`,
      status: DOCTOR_STATUS.PENDING,
      patientsCount: 0,
      sessionsCount: 0,
      revenue: 0,
      submittedDate: new Date().toISOString(),
      ...payload,
    }
    doctors = [newDoctor, ...doctors]
    return simulateLatency(newDoctor)
  },

  async update(doctorId, payload) {
    doctors = doctors.map((doc) => (doc.id === doctorId ? { ...doc, ...payload } : doc))
    return simulateLatency(doctors.find((doc) => doc.id === doctorId))
  },

  async approve(doctorId) {
    return this.update(doctorId, { status: DOCTOR_STATUS.VERIFIED })
  },

  async reject(doctorId) {
    return this.update(doctorId, { status: DOCTOR_STATUS.REJECTED })
  },

  async disable(doctorId) {
    return this.update(doctorId, { status: DOCTOR_STATUS.DISABLED })
  },

  async remove(doctorId) {
    doctors = doctors.filter((doc) => doc.id !== doctorId)
    return simulateLatency({ success: true })
  },
}
