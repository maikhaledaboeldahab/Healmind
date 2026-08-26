import api from './api';

export const loginRequest = (credentials) => api.post('/auth/login', credentials);

export const registerPatientRequest = (payload) => api.post('/auth/register/patient', payload);

export const registerDoctorRequest = (formData) => api.post('/auth/register/doctor', formData);

export const fetchProfile = () => api.get('/profile');

export const logoutRequest = () => api.post('/auth/logout');
