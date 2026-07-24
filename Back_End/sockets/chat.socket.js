// JWT
const jwt = require("jsonwebtoken");
// Auth Middlewar
const socketAuth = (socket, next) => {
  try {
    // Get Token
    const token = socket.handshake.headers.token;
    if (!token) return next(new Error("Token Not Found"));
    // verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = payload.id;
    socket.role = payload.role;
    // next
    next();
  } catch (error) {
    return next(new Error("Token Not Found"));
  }
};

const socketChatController = (io) => {
  // Use Middleware
  io.use(socketAuth);

  // Create Connection
  io.on("connection", (socket) => {
    console.log(`User is ${socket.userId} & Role ${socket.role} is Connection`);
    // Create Room To Admin & User
    if (socket.role === "admin") {
      socket.join("room_admins");
    } else if (socket.role === "user") {
      socket.join(`room_${socket.userId}`);
    }

    // S1 => User Send Problem To Admin
    socket.on("sendMsg", (data) => {
      io.to("room_admins").emit("receiveMsg", {
        msg: data.msg,
        user: socket.userId,
      });
    });
  });
};

module.exports = socketChatController;
