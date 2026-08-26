import { apiClient } from './apiClient';

export function normalizePatient(p) {
  if (!p) return null;
  return {
    ...p,
    id: p._id || p.id,
    name: p.name || p.fullName || `Patient ${p.email?.split('@')[0]}`,
    registeredDate: p.registeredDate || p.createdAt || new Date().toISOString(),
    status: p.status || (p.isActive ? 'active' : 'suspended'),
    communityStatus: p.communityStatus || p.communityAccess || 'view_only',
  };
}

export const patientService = {
  async getAll() {
    const res = await apiClient.get('/admin/patients');
    const raw = res.data?.data || res.data;
    return Array.isArray(raw) ? raw.map(normalizePatient) : [];
  },

  async getById(patientId) {
    const res = await apiClient.get(`/admin/patients/${patientId}`);
    const raw = res.data?.data || res.data;
    return normalizePatient(raw);
  },

  async suspend(patientId) {
    const res = await apiClient.patch(`/admin/users/${patientId}/deactivate`);
    const raw = res.data?.data || res.data;
    return normalizePatient({ ...raw, isActive: false, status: 'suspended' });
  },

  async activate(patientId) {
    const res = await apiClient.patch(`/admin/users/${patientId}/activate`);
    const raw = res.data?.data || res.data;
    return normalizePatient({ ...raw, isActive: true, status: 'active' });
  },

  async remove(patientId) {
    const res = await apiClient.delete(`/admin/patients/${patientId}`);
    return res.data;
  },
};

export default patientService;
