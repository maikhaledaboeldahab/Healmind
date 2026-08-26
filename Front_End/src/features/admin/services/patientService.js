import { MOCK_PATIENTS } from '../constants/mockData'
import { apiClient, simulateLatency } from './apiClient'

let patients = [...MOCK_PATIENTS]

function normalizePatient(p) {
  if (!p) return null
  return {
    ...p,
    id: p.id || p._id,
    name: p.name || p.fullName || `Patient ${p.email?.split('@')[0]}`,
    registeredDate: p.registeredDate || p.createdAt || new Date().toISOString(),
    status: p.status || (p.isActive ? 'active' : 'suspended'),
    communityStatus: p.communityStatus || p.communityAccess || 'view_only',
  }
}

export const patientService = {
  async getAll() {
    try {
      const res = await apiClient.get('/admin/patients')
      const raw = res.data?.data || res.data
      return Array.isArray(raw) ? raw.map(normalizePatient) : patients
    } catch {
      return simulateLatency([...patients])
    }
  },

  async getById(patientId) {
    try {
      const res = await apiClient.get(`/admin/patients/${patientId}`)
      const raw = res.data?.data || res.data
      return normalizePatient(raw) || (patients.find((patient) => patient.id === patientId) ?? null)
    } catch {
      return simulateLatency(patients.find((patient) => patient.id === patientId) ?? null)
    }
  },

  async create(payload) {
    try {
      const res = await apiClient.post('/admin/patients', payload)
      return normalizePatient(res.data?.data || res.data)
    } catch {
      const newPatient = {
        id: `PAT-${String(patients.length + 1).padStart(4, '0')}`,
        registeredDate: new Date().toISOString(),
        status: 'active',
        communityStatus: 'view_only',
        approvalHistory: [],
        ...payload,
      }
      patients = [newPatient, ...patients]
      return simulateLatency(newPatient)
    }
  },

  async update(patientId, payload) {
    try {
      const res = await apiClient.patch(`/admin/patients/${patientId}`, payload)
      return normalizePatient(res.data?.data || res.data)
    } catch {
      patients = patients.map((patient) => (patient.id === patientId ? { ...patient, ...payload } : patient))
      return simulateLatency(patients.find((patient) => patient.id === patientId))
    }
  },

  async suspend(patientId) {
    try {
      await apiClient.patch(`/admin/users/${patientId}/deactivate`)
      return this.update(patientId, { status: 'suspended' })
    } catch {
      return this.update(patientId, { status: 'suspended' })
    }
  },

  async activate(patientId) {
    try {
      await apiClient.patch(`/admin/users/${patientId}/activate`)
      return this.update(patientId, { status: 'active' })
    } catch {
      return this.update(patientId, { status: 'active' })
    }
  },

  async remove(patientId) {
    try {
      const res = await apiClient.delete(`/admin/patients/${patientId}`)
      return res.data
    } catch {
      patients = patients.filter((patient) => patient.id !== patientId)
      return simulateLatency({ success: true })
    }
  },
}
