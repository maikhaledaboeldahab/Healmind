import { apiClient } from './apiClient';

export function normalizePaymentFromSession(s) {
  if (!s) return null;
  const amount = (s.depositPaid ? (s.depositAmount || 0) : 0) + (s.balancePaid ? (s.balance || 0) : 0) || s.sessionPrice || 0;
  return {
    id: s.stripePaymentIntentId || `PAY-${s._id || s.id}`,
    sessionId: s._id || s.id,
    patientId: s.patientId?._id || s.patientId,
    patientName: s.patientId?.name || 'Patient',
    doctorId: s.doctorId?._id || s.doctorId,
    doctorName: s.doctorId?.name || 'Doctor',
    amount: amount > 0 ? amount : (s.sessionPrice || 50),
    currency: 'USD',
    status: s.depositPaid || s.balancePaid ? 'paid' : (s.status === 'completed' ? 'paid' : 'pending'),
    paymentMethod: s.paymentMethod || 'card',
    paymentDate: s.updatedAt || s.createdAt || new Date().toISOString(),
    depositPaid: Boolean(s.depositPaid),
    balancePaid: Boolean(s.balancePaid),
  };
}

export const paymentService = {
  async getAll() {
    const res = await apiClient.get('/session');
    const raw = res.data?.data || res.data?.sessions || res.data;
    if (!Array.isArray(raw)) return [];
    return raw.map(normalizePaymentFromSession);
  },

  async getById(paymentId) {
    const list = await this.getAll();
    return list.find((p) => p.id === paymentId || p.sessionId === paymentId) || null;
  },

  async getSummary() {
    const payments = await this.getAll();
    const paidPayments = payments.filter((p) => p.status === 'paid');
    const totalRevenue = paidPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const now = new Date();
    const monthlyRevenue = paidPayments
      .filter((p) => {
        const d = new Date(p.paymentDate);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    return { totalRevenue, monthlyRevenue, count: paidPayments.length };
  },
};

export default paymentService;
