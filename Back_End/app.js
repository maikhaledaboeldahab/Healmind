require("dotenv").config();
const http = require("http");
const cors = require('cors');

// Packages
const express = require("express");
const morgan = require("morgan");
const { Server } = require("socket.io");

// App Initialization
const app = express();

// Database
const connectedDB = require("./config/db");
connectedDB();

// Global Middleware
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl.startsWith('/api/payments/webhook')) {
      req.rawBody = buf;
    }
  }
}));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HealMind API is running ",
  });
});

// Test Route
app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Test Route",
  });
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/session", require("./routes/session.routes"));
app.use("/api/session", require("./routes/video.routes"));
app.use("/api/profile", require("./routes/profile.routes"));
app.use("/api/doctor/community-access", require("./routes/communityAccess.routes"));
app.use("/api/doctor", require("./routes/doctor.routs"));
app.use("/api/reviews", require("./routes/review.routes"));
app.use("/api/contactus", require("./routes/contactus.routes"));
app.use("/api/conversations", require("./routes/conversation.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/ticket", require("./routes/ticket.routes"));
app.use("/api/posts", require("./routes/post.routes"));
app.use("/api/payments", require("./routes/payment.routes"));
app.use("/api/rag", require("./routes/rag.routes"));


// ================================
// 404 Handler
// ================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// ================================
// Global Error Handler
// ================================
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ================================
// Server + Socket.IO
// ================================
const PORT = process.env.PORT || 3000;

// بدل app.listen، بنعمل http server يدوي عشان نقدر نركب عليه socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // في الإنتاج غيّرها لدومين الفرونت اند
    methods: ["GET", "POST"],
  },
});

// ✅ نخزن الـ io instance جوه الـ app نفسه
// عشان أي controller يقدر يوصلها بـ req.app.get("io")
// من غير ما نعمل circular require بينه وبين chat.socket.js
app.set("io", io);

// تشغيل منطق الشات وتوصيله بالـ io instance
require("./sockets/chat.socket")(io);
require("./sockets/Community.socket ")(io);

// Start background session cleanup task
const { startSessionCleanup } = require("./utils/sessionCleanup");
startSessionCleanup(60000); // Check and expire pending sessions every 60 seconds

const appServer = server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, appServer, io };