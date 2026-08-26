import { SESSION_STATUS } from '../constants/statusEnums';
import { apiClient } from './apiClient';

export function normalizeSession(s) {
  if (!s) return null;

  let status = SESSION_STATUS.UPCOMING;
  const rawStatus = (s.status || '').toLowerCase();
  if (rawStatus === 'completed') status = SESSION_STATUS.COMPLETED;
  else if (rawStatus === 'cancelled' || rawStatus === 'rejected') status = SESSION_STATUS.CANCELLED;
  else if (rawStatus === 'pending') status = SESSION_STATUS.UPCOMING;
  else if (rawStatus === 'confirmed') status = SESSION_STATUS.UPCOMING;

  return {
    ...s,
    id: s._id || s.id,
    patientId: s.patientId?._id || s.patientId,
    patientName: s.patientId?.name || s.patientname || 'Patient',
    doctorId: s.doctorId?._id || s.doctorId,
    doctorName: s.doctorId?.name || s.doctorname || 'Doctor',
    startTime: s.scheduledTime,
    endTime: s.scheduledTime,
    date: s.scheduledTime ? new Date(s.scheduledTime).toLocaleDateString() : 'Scheduled',
    type: s.type || 'followup',
    mode: s.mode || 'visit',
    status,
    rawStatus: s.status,
    sessionPrice: s.sessionPrice || 0,
    depositAmount: s.depositAmount || 0,
    depositPaid: s.depositPaid || false,
    balance: s.balance || 0,
    balancePaid: s.balancePaid || false,
  };
}

export const sessionService = {
  async getAll() {
    const res = await apiClient.get('/session');
    const raw = res.data?.data || res.data?.sessions || res.data;
    return Array.isArray(raw) ? raw.map(normalizeSession) : [];
  },

  async getById(sessionId) {
    const res = await apiClient.get(`/session/${sessionId}`);
    const raw = res.data?.data || res.data;
    return normalizeSession(raw);
  },

  async update(sessionId, payload) {
    const res = await apiClient.patch(`/session/${sessionId}`, payload);
    const raw = res.data?.data || res.data;
    return normalizeSession(raw);
  },

  async reschedule(sessionId, { startTime, newScheduledTime }) {
    const timeToSend = newScheduledTime || startTime;
    const res = await apiClient.patch(`/session/${sessionId}/reschedule`, { newScheduledTime: timeToSend });
    const raw = res.data?.data || res.data;
    return normalizeSession(raw);
  },

  async cancel(sessionId) {
    return this.update(sessionId, { status: 'cancelled' });
  },

  async markCompleted(sessionId) {
    return this.update(sessionId, { status: 'completed' });
  },
};

export default sessionService;
