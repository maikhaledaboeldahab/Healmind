import api from './api';

export const createBooking = (payload) => api.post('/payments/checkout-session', payload);

export const mockChargeSession = (sessionId) => api.post('/payments/mock-charge', { sessionId });

export const fetchUpcomingSessions = () => api.get('/session/my-sessions');

export const fetchSessionHistory = () => api.get('/session/my-sessions');

export const payForSession = (sessionId) => api.post('/payments/mock-charge', { sessionId });
