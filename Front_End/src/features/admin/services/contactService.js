import { apiClient } from './apiClient';

export function normalizeContact(c) {
  if (!c) return null;
  return {
    ...c,
    id: c._id || c.id,
    name: c.name || 'User',
    email: c.email || '',
    subject: c.subject || 'Inquiry',
    message: c.message || '',
    isRead: Boolean(c.isRead),
    createdAt: c.createdAt || new Date().toISOString(),
  };
}

export const contactService = {
  async getAll() {
    const response = await apiClient.get('/contactus');
    const raw = response.data?.data || response.data?.contacts || response.data;
    return Array.isArray(raw) ? raw.map(normalizeContact) : [];
  },

  async getById(contactId) {
    const response = await apiClient.get(`/contactus/${contactId}`);
    const raw = response.data?.data || response.data;
    return normalizeContact(raw);
  },

  async markAsRead(contactId) {
    const response = await apiClient.patch(`/contactus/${contactId}/read`);
    const raw = response.data?.data || response.data;
    return normalizeContact(raw);
  },

  async deleteContact(contactId) {
    const response = await apiClient.delete(`/contactus/${contactId}`);
    return response.data;
  },
};

export default contactService;
