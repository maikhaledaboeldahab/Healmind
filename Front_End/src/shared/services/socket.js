import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const connectSocket = (token) => {
  const authToken = token || window.localStorage.getItem('healmind_token');
  if (authToken) {
    if (socket.connected && socket.auth?.token !== authToken) {
      socket.disconnect();
    }
    socket.auth = { token: authToken };
    if (!socket.connected) {
      socket.connect();
    }
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const getSocket = () => socket;

export default socket;
