import { MOCK_DOCTORS } from '../constants/mockData'
import { DOCTOR_STATUS } from '../constants/statusEnums'
import { apiClient, simulateLatency } from './apiClient'

let doctors = [...MOCK_DOCTORS]

function getFullCertUrl(cert) {
  if (!cert || cert === '#') return '#'
  if (cert.startsWith('http://') || cert.startsWith('https://') || cert.startsWith('data:')) {
    return cert
  }
  const cleanPath = cert.startsWith('/') ? cert : `/${cert}`
  return `http://localhost:3000${cleanPath}`
}

function normalizeDoctor(doc) {
  if (!doc) return null
  const cert = doc.certificateUrl || doc.certificate || '#'
  
  let status = DOCTOR_STATUS.PENDING
  if (doc.isActive === false || doc.status === 'disabled' || doc.status === DOCTOR_STATUS.DISABLED) {
    status = DOCTOR_STATUS.DISABLED
  } else if (doc.status === DOCTOR_STATUS.REJECTED || doc.approvalStatus === 'rejected') {
    status = DOCTOR_STATUS.REJECTED
  } else if (doc.isApproved || doc.status === 'verified' || doc.approvalStatus === 'approved') {
    status = DOCTOR_STATUS.VERIFIED
  }

  return {
    ...doc,
    id: doc.id || doc._id,
    name: doc.name || doc.fullName || `Dr. ${doc.email?.split('@')[0]}`,
    status,
    submittedDate: doc.submittedDate || doc.createdAt || new Date().toISOString(),
    specialization: doc.specialization || 'General Psychology',
    yearsOfExperience: doc.yearsOfExperience || doc.experienceYears || 1,
    certificateUrl: getFullCertUrl(cert),
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
      return this.update(doctorId, { status: DOCTOR_STATUS.VERIFIED, isApproved: true })
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
      const res = await apiClient.patch(`/admin/users/${doctorId}/deactivate`)
      const raw = res.data?.data || res.data
      return normalizeDoctor({ ...raw, isActive: false, status: 'disabled' })
    } catch {
      return this.update(doctorId, { status: DOCTOR_STATUS.DISABLED, isActive: false })
    }
  },

  async remove(doctorId) {
    try {
      const res = await apiClient.delete(`/admin/users/${doctorId}`)
      doctors = doctors.filter((doc) => doc.id !== doctorId)
      return res.data
    } catch {
      doctors = doctors.filter((doc) => doc.id !== doctorId)
      return simulateLatency({ success: true })
    }
  },
}
