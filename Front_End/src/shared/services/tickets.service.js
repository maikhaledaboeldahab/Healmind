import api from './api';

/**
 * Community Access Ticket service
 */
export const createTicketRequest = (ticketData) => api.post('/ticket/patient', ticketData);

export const fetchTickets = () => api.get('/ticket/patient');

export const fetchTicketById = (id) => api.get(`/ticket/${id}`);

export const fetchAvailableDoctorsForTicket = (ticketId) => api.get(`/ticket/admin/${ticketId}/available-doctors`);

export const assignDoctorToTicket = (ticketId, doctorId) => api.patch(`/ticket/admin/${ticketId}/assign`, { doctorId });

