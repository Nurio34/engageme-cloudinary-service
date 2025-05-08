import { postNotifications } from "./postNotifications.js";

export const socketControllers = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("addUser", (userId) => {
      global.onlineUsers.set(userId, socket.id);

      console.log(`User ${userId} added with socket ID: ${socket.id}`);
    });

    postNotifications(io, socket);

    socket.on("disconnect", () => {
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
