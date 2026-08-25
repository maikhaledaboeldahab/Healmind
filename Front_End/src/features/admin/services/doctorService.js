import { MOCK_DOCTORS } from '../constants/mockData'
import { DOCTOR_STATUS } from '../constants/statusEnums'
import { apiClient, simulateLatency } from './apiClient'

let doctors = [...MOCK_DOCTORS]

function normalizeDoctor(doc) {
  if (!doc) return null
  return {
    ...doc,
    id: doc.id || doc._id,
    name: doc.name || doc.fullName || `Dr. ${doc.email?.split('@')[0]}`,
    status: doc.status || doc.approvalStatus || (doc.isApproved ? DOCTOR_STATUS.VERIFIED : DOCTOR_STATUS.PENDING),
    submittedDate: doc.submittedDate || doc.createdAt || new Date().toISOString(),
    specialization: doc.specialization || 'General Psychology',
    yearsOfExperience: doc.yearsOfExperience || doc.experienceYears || 1,
    certificateUrl: doc.certificateUrl || doc.certificate || '#',
  }
}

export const doctorService = {
  async getAll() {
    try {
      const res = await apiClient.get('/admin/doctors')
      const raw = res.data?.data || res.data || doctors
      return Array.isArray(raw) ? raw.map(normalizeDoctor) : doctors
    } catch {
      return simulateLatency([...doctors])
    }
  },

  async getPendingVerification() {
    try {
      const res = await apiClient.get('/admin/doctors/pending')
      const raw = res.data?.data || res.data
      return Array.isArray(raw) ? raw.map(normalizeDoctor) : doctors.filter((doc) => doc.status === DOCTOR_STATUS.PENDING)
    } catch {
      return simulateLatency(doctors.filter((doc) => doc.status === DOCTOR_STATUS.PENDING))
    }
  },

  async getById(doctorId) {
    try {
      const res = await apiClient.get(`/admin/doctors/${doctorId}`)
      const raw = res.data?.data || res.data
      return normalizeDoctor(raw) || (doctors.find((doc) => doc.id === doctorId) ?? null)
    } catch {
      return simulateLatency(doctors.find((doc) => doc.id === doctorId) ?? null)
    }
  },

  async create(payload) {
    try {
      const res = await apiClient.post('/admin/doctors', payload)
      return normalizeDoctor(res.data?.data || res.data)
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
      const res = await apiClient.patch(`/admin/doctors/${doctorId}`, payload)
      return normalizeDoctor(res.data?.data || res.data)
    } catch {
      doctors = doctors.map((doc) => (doc.id === doctorId ? { ...doc, ...payload } : doc))
      return simulateLatency(doctors.find((doc) => doc.id === doctorId))
    }
  },

  async approve(doctorId) {
    try {
      const res = await apiClient.patch(`/admin/doctors/${doctorId}/approve`)
      return normalizeDoctor(res.data?.data || res.data)
    } catch {
      return this.update(doctorId, { status: DOCTOR_STATUS.VERIFIED })
    }
  },

  async reject(doctorId) {
    try {
      const res = await apiClient.patch(`/admin/doctors/${doctorId}/reject`)
      return normalizeDoctor(res.data?.data || res.data)
    } catch {
      return this.update(doctorId, { status: DOCTOR_STATUS.REJECTED })
    }
  },

  async disable(doctorId) {
    try {
      const res = await apiClient.patch(`/admin/doctors/${doctorId}/disable`)
      return normalizeDoctor(res.data?.data || res.data)
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
