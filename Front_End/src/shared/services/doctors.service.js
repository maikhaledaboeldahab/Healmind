import api from './api';

export const fetchDoctors = (params) => api.get('/doctors', { params });

export const fetchDoctorById = (id) => api.get(`/doctors/${id}`);

export const fetchDoctorSlots = (id) => api.get(`/doctors/${id}/slots`);
