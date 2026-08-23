import api from './api';

/**
 * Community Access Ticket service
 */
export const createTicketRequest = (ticketData) => api.post('/tickets', ticketData);

export const fetchTickets = () => api.get('/tickets');

export const fetchTicketById = (id) => api.get(`/tickets/${id}`);
