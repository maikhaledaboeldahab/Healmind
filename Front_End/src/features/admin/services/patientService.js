import { MOCK_PATIENTS } from '../constants/mockData'
import { simulateLatency } from './apiClient'

let patients = [...MOCK_PATIENTS]

export const patientService = {
  async getAll() {
    return simulateLatency([...patients])
  },

  async getById(patientId) {
    return simulateLatency(patients.find((patient) => patient.id === patientId) ?? null)
  },

  async create(payload) {
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
  },

  async update(patientId, payload) {
    patients = patients.map((patient) => (patient.id === patientId ? { ...patient, ...payload } : patient))
    return simulateLatency(patients.find((patient) => patient.id === patientId))
  },

  async suspend(patientId) {
    return this.update(patientId, { status: 'suspended' })
  },

  async activate(patientId) {
    return this.update(patientId, { status: 'active' })
  },

  async remove(patientId) {
    patients = patients.filter((patient) => patient.id !== patientId)
    return simulateLatency({ success: true })
  },
}
