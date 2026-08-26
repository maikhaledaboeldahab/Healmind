import api from './api';

/**
 * Submit a Contact Us support message to the backend.
 * Payload contract: { name, email, subject, message }
 */
export const submitContactMessage = (payload) => {
  const sanitized = {
    name: payload.name?.trim(),
    email: payload.email?.trim().toLowerCase(),
    subject: payload.subject?.trim(),
    message: payload.message?.trim(),
  };
  return api.post('/contactus', sanitized);
};
