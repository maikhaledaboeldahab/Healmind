import api from './api';

// These call the real backend once it is available.
// Until then, AuthContext simulates these flows on the frontend.

export const loginRequest = (credentials) => api.post('/auth/login', credentials);

export const registerRequest = (payload) => api.post('/auth/register', payload);

export const fetchProfile = () => api.get('/auth/me');
