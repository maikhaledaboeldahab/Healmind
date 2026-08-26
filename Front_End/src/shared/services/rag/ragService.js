import api from '../api';

export const sendMessageToRAG = async (message, chatHistory = []) => {
  const response = await api.post('/rag/chat', {
    message,
    chat_history: chatHistory,
  });

  return response.data;
};