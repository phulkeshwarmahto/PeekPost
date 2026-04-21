import { useEffect } from "react";

import { connectSocket, getSocket } from "../socket/socket";

export const useSocket = (token, handlers = {}) => {
  useEffect(() => {
    if (!token) return undefined;

    const socket = connectSocket(token);

    for (const [event, handler] of Object.entries(handlers)) {
      socket.on(event, handler);
    }

    return () => {
      const current = getSocket();
      if (!current) return;

      for (const [event, handler] of Object.entries(handlers)) {
        current.off(event, handler);
      }
    };
  }, [token, handlers]);
};