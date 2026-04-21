import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let ioInstance = null;

export const initSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  ioInstance.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next();
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.userId;
      return next();
    } catch (_error) {
      return next(new Error("Invalid socket token"));
    }
  });

  ioInstance.on("connection", (socket) => {
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
      socket.broadcast.emit("user:online", { userId: socket.userId });
    }

    socket.on("typing:start", ({ conversationId, toUserId }) => {
      ioInstance.to(`user:${toUserId}`).emit("typing:start", {
        conversationId,
        fromUserId: socket.userId,
      });
    });

    socket.on("typing:stop", ({ conversationId, toUserId }) => {
      ioInstance.to(`user:${toUserId}`).emit("typing:stop", {
        conversationId,
        fromUserId: socket.userId,
      });
    });

    socket.on("message:seen", ({ messageId, toUserId }) => {
      ioInstance.to(`user:${toUserId}`).emit("message:seen", {
        messageId,
        byUserId: socket.userId,
      });
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        socket.broadcast.emit("user:offline", { userId: socket.userId });
      }
    });
  });

  return ioInstance;
};

export const getIO = () => ioInstance;