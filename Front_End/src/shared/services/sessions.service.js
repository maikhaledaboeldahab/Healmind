import api from './api';

/**
 * Fetch video call room information for a given session.
 * 
 * Endpoint: GET /api/session/:sessionId/video-call
 * Headers: Authorization: Bearer <token> (attached automatically by api interceptor)
 * 
 * @param {string|number} sessionId
 * @returns {Promise<{ roomName: string, jitsiDomain: string, displayName: string }>}
 */
export const getVideoCallSession = async (sessionId) => {
  const response = await api.get(`/api/session/${sessionId}/video-call`);
  return response.data;
};
