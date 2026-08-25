import api from './api';

export const createBooking = (payload) => api.post('/bookings', payload);

export const fetchUpcomingSessions = () => api.get('/bookings/upcoming');

export const fetchSessionHistory = () => api.get('/bookings/history');

export const payForSession = (bookingId, paymentDetails) =>
  api.post(`/bookings/${bookingId}/pay`, paymentDetails);
