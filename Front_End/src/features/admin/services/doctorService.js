import { DOCTOR_STATUS } from '../constants/statusEnums';
import { apiClient } from './apiClient';

function getFullCertUrl(cert) {
  if (!cert || cert === '#') return '#';
  if (cert.startsWith('http://') || cert.startsWith('https://') || cert.startsWith('data:')) {
    return cert;
  }
  const cleanPath = cert.startsWith('/') ? cert : `/${cert}`;
  return `http://localhost:3000${cleanPath}`;
}

export function normalizeDoctor(doc) {
  if (!doc) return null;
  const cert = doc.certificateUrl || doc.certificate || '#';

  let status = DOCTOR_STATUS.PENDING;
  if (doc.isActive === false || doc.status === 'disabled' || doc.status === DOCTOR_STATUS.DISABLED) {
    status = DOCTOR_STATUS.DISABLED;
  } else if (doc.status === DOCTOR_STATUS.REJECTED || doc.approvalStatus === 'rejected') {
    status = DOCTOR_STATUS.REJECTED;
  } else if (doc.isApproved || doc.status === 'verified' || doc.approvalStatus === 'approved') {
    status = DOCTOR_STATUS.VERIFIED;
  }

  return {
    ...doc,
    id: doc._id || doc.id,
    name: doc.name || doc.fullName || `Dr. ${doc.email?.split('@')[0]}`,
    status,
    submittedDate: doc.submittedDate || doc.createdAt || new Date().toISOString(),
    specialization: doc.specialization || 'General Psychology',
    yearsOfExperience: doc.yearsOfExperience || doc.experienceYears || 1,
    certificateUrl: getFullCertUrl(cert),
    patientsCount: doc.patientsCount || 0,
    sessionsCount: doc.sessionsCount || 0,
    revenue: doc.revenue || 0,
  };
}

export const doctorService = {
  async getAll() {
    const res = await apiClient.get('/admin/doctors');
    const raw = res.data?.data || res.data;
    return Array.isArray(raw) ? raw.map(normalizeDoctor) : [];
  },

  async getPendingVerification() {
    const res = await apiClient.get('/admin/doctors/pending');
    const raw = res.data?.data || res.data;
    return Array.isArray(raw) ? raw.map(normalizeDoctor) : [];
  },

  async getById(doctorId) {
    const res = await apiClient.get(`/admin/doctors/${doctorId}`);
    const raw = res.data?.data || res.data;
    return normalizeDoctor(raw);
  },

  async approve(doctorId) {
    const res = await apiClient.patch(`/admin/doctors/${doctorId}/approve`);
    return normalizeDoctor(res.data?.data || res.data);
  },

  async reject(doctorId) {
    const res = await apiClient.patch(`/admin/doctors/${doctorId}/reject`);
    return normalizeDoctor(res.data?.data || res.data);
  },

  async disable(doctorId) {
    const res = await apiClient.patch(`/admin/users/${doctorId}/deactivate`);
    const raw = res.data?.data || res.data;
    return normalizeDoctor({ ...raw, isActive: false, status: DOCTOR_STATUS.DISABLED });
  },

  async activate(doctorId) {
    const res = await apiClient.patch(`/admin/users/${doctorId}/activate`);
    const raw = res.data?.data || res.data;
    return normalizeDoctor({ ...raw, isActive: true, status: DOCTOR_STATUS.VERIFIED });
  },

  async remove(doctorId) {
    const res = await apiClient.delete(`/admin/users/${doctorId}`);
    return res.data;
  },
};

export default doctorService;
