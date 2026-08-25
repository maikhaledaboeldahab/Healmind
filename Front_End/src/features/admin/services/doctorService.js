import { MOCK_DOCTORS } from '../constants/mockData'
import { DOCTOR_STATUS } from '../constants/statusEnums'
import { apiClient, simulateLatency } from './apiClient'

let doctors = [...MOCK_DOCTORS]

export const doctorService = {
  async getAll() {
    try {
      const res = await apiClient.get('/admin/doctors')
      return res.data?.data || res.data || doctors
    } catch {
      return simulateLatency([...doctors])
    }
  },

  async getPendingVerification() {
    try {
      const res = await apiClient.get('/admin/doctors/pending')
      return res.data?.data || res.data
    } catch {
      return simulateLatency(doctors.filter((doc) => doc.status === DOCTOR_STATUS.PENDING))
    }
  },

  async getById(doctorId) {
    try {
      const res = await apiClient.get(`/admin/doctors/${doctorId}`)
      return res.data?.data || res.data
    } catch {
      return simulateLatency(doctors.find((doc) => doc.id === doctorId) ?? null)
    }
  },

  async create(payload) {
    try {
      const res = await apiClient.post('/admin/doctors', payload)
      return res.data?.data || res.data
    } catch {
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
    }
  },

  async update(doctorId, payload) {
    try {
      const res = await apiClient.put(`/admin/doctors/${doctorId}`, payload)
      return res.data?.data || res.data
    } catch {
      doctors = doctors.map((doc) => (doc.id === doctorId ? { ...doc, ...payload } : doc))
      return simulateLatency(doctors.find((doc) => doc.id === doctorId))
    }
  },

  async approve(doctorId) {
    try {
      const res = await apiClient.put(`/admin/doctors/${doctorId}/approve`)
      return res.data?.data || res.data
    } catch {
      return this.update(doctorId, { status: DOCTOR_STATUS.VERIFIED })
    }
  },

  async reject(doctorId) {
    try {
      const res = await apiClient.put(`/admin/doctors/${doctorId}/reject`)
      return res.data?.data || res.data
    } catch {
      return this.update(doctorId, { status: DOCTOR_STATUS.REJECTED })
    }
  },

  async disable(doctorId) {
    try {
      const res = await apiClient.put(`/admin/doctors/${doctorId}/disable`)
      return res.data?.data || res.data
    } catch {
      return this.update(doctorId, { status: DOCTOR_STATUS.DISABLED })
    }
  },

  async remove(doctorId) {
    try {
      const res = await apiClient.delete(`/admin/doctors/${doctorId}`)
      return res.data
    } catch {
      doctors = doctors.filter((doc) => doc.id !== doctorId)
      return simulateLatency({ success: true })
    }
  },
}
