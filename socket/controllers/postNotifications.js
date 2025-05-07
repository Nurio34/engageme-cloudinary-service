export const postNotifications = (io, socket) => {
  socket.on("postLikeNotification", (data) => {
    const { postOwnerId, postLikeNotification } = data;

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

  socket.on("postCommentNotification", (data) => {
    const { postOwnerId, postCommentNotification } = data;

    const postOwnerSocketId = global.onlineUsers.get(postOwnerId);
    console.log({ postOwnerId, postCommentNotification });

    if (postOwnerSocketId) {
      io.to(postOwnerSocketId).emit(
        "postCommentNotification",
        postCommentNotification
      );
    } else {
      console.log(`User ${postOwnerId} is not online.`);
    }
  });

  socket.on("commentLikeNotification", (data) => {
    const { commentOwnerId, postCommentLikeNotification } = data;

    const commentOwnerSocketId = global.onlineUsers.get(commentOwnerId);

    if (commentOwnerId) {
      io.to(commentOwnerSocketId).emit(
        "commentLikeNotification",
        postCommentLikeNotification
      );
    } else {
      console.log(`User ${postOwnerId} is not online.`);
    }
  });

  socket.on("replyNotification", (data) => {
    const { commentOwnerId, replyNotification } = data;

    const commentOwnerSocketId = global.onlineUsers.get(commentOwnerId);

    if (commentOwnerId) {
      io.to(commentOwnerSocketId).emit("replyNotification", replyNotification);
    } else {
      console.log(`User ${postOwnerId} is not online.`);
    }
  });

  socket.on("replyLikeNotification", (data) => {
    const { replyOwnerId, replyLikeNotification } = data;

    const replyOwnerSocketId = global.onlineUsers.get(replyOwnerId);

    if (replyOwnerId) {
      io.to(replyOwnerSocketId).emit(
        "replyLikeNotification",
        replyLikeNotification
      );
    } else {
      console.log(`User ${postOwnerId} is not online.`);
    }
  });
};
