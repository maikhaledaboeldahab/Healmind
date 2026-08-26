import { apiClient } from './apiClient';

export function normalizeTicket(t) {
  if (!t) return null;
  return {
    ...t,
    id: t._id || t.id,
    patientId: t.patientId?._id || t.patientId,
    patientName: t.patientId?.name || t.patientName || 'Patient',
    doctorId: t.assignedDoctor?._id || t.assignedDoctor || t.doctorId,
    doctorName: t.assignedDoctor?.name || t.doctorName || null,
    scheduledTime: t.scheduledTime,
    mode: t.mode || 'video',
    status: t.status || 'pending',
    createdAt: t.createdAt || new Date().toISOString(),
    updatedAt: t.updatedAt || t.assignedAt || t.createdAt,
  };
}

export const ticketService = {
  async getAll() {
    const res = await apiClient.get('/ticket/admin/pending');
    const raw = res.data?.data || res.data?.tickets || res.data;
    return Array.isArray(raw) ? raw.map(normalizeTicket) : [];
  },

  async getById(ticketId) {
    const res = await apiClient.get(`/ticket/${ticketId}`);
    const raw = res.data?.data || res.data;
    return normalizeTicket(raw);
  },

  async getAvailableDoctors(ticketId) {
    const res = await apiClient.get(`/ticket/admin/${ticketId}/available-doctors`);
    const raw = res.data?.data || res.data;
    return Array.isArray(raw) ? raw : [];
  },

  async assignDoctor(ticketId, doctorId) {
    const res = await apiClient.patch(`/ticket/admin/${ticketId}/assign`, { doctorId });
    const raw = res.data?.data || res.data;
    return normalizeTicket(raw);
  },
};

export default ticketService;
