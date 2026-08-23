import axios from 'axios';

const RAG_API_URL = '/rag';

export const sendMessageToRAG = async (message, chatHistory = []) => {
  let token = null;
  try {
    const stored = window.localStorage.getItem('healmind_auth_user');
    if (stored) {
      const parsed = JSON.parse(stored);
      token = parsed?.token || parsed?.accessToken || parsed?.jwt;
    }
  } catch {
    // Ignore JSON parse error
  }

  if (!token) {
    token =
      window.localStorage.getItem('healmind_token') ||
      window.localStorage.getItem('token') ||
      window.sessionStorage.getItem('healmind_admin_token') ||
      window.sessionStorage.getItem('token');
  }

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await axios.post(
    `${RAG_API_URL}/chat`,
    {
      message,
      chat_history: chatHistory,
    },
    { headers }
  );

  return response.data;
};