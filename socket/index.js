import { Server } from "socket.io";
import { socketControllers } from "./controllers/index.js";

let io;
global.onlineUsers = new Map();

export const initializeSocket = (server) => {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        const allowedOrigins = [
          process.env.ORIGIN_URL, // add more origins if needed
        ];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    },
  });

  socketControllers(io);
};

// export const getIO = () => {
//   if (!io) {
//     throw new Error("Socket.io not initialized yet!");
//   }
//   return io;
// };
