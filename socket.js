import { Server } from "socket.io";

let io;
global.onlineUsers = new Map(); // The key will be the userId, and the value will be the socketId.

export const initializeSocket = (server) => {
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

  io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    // Store socket IDs in a global map
    socket.on("addUser", (userId) => {
      console.log({ userId });

      global.onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} added with socket ID: ${socket.id}`);
    });

    // When a message is received, check the receiver's socket ID and emit the message
    socket.on("postLikeNotification", (data) => {
      console.log(data);

      const { postOwnerId, postLikeNotification } = data;

      // Look up the socket ID of the post owner
      const postOwnerSocketId = global.onlineUsers.get(postOwnerId);

      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit(
          "postLikeNotification",
          postLikeNotification
        );
      } else {
        console.log(`User ${postOwnerId} is not online.`);
      }
    });

    socket.on("disconnect", () => {
      // Clean up when the user disconnects
      global.onlineUsers?.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          global.onlineUsers.delete(userId);
          console.log(
            `User ${userId} disconnected and removed from onlineUsers.`
          );
        }
      });
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized yet!");
  }
  return io;
};
