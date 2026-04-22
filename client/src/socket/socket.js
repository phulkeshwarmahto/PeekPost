import { io } from "socket.io-client";

let socketInstance;

export const connectSocket = (token) => {
  if (!token) return null;

  if (socketInstance?.connected) {
    return socketInstance;
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;

  socketInstance = io(socketUrl, {
    auth: { token },
  });

  return socketInstance;
};

export const getSocket = () => socketInstance;

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
  }
};
