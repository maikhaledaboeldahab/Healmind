
require("dotenv").config();


// Packages
const express = require("express");
const morgan = require("morgan");


// App Initialization

const app = express();



// Database

const connectedDB = require("./config/db");
connectedDB();


// Global Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/profile", require("./routes/profile.routes"));
app.use("/api/doctor", require("./routes/doctor.routs"));
app.use("/api/reviews", require("./routes/review.routes"));
app.use("/api/contactus", require("./routes/contactus.routes"));

// app.use("/api/dashboard", require("./routes/dashboard.routes"));

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
// Server
// ================================
const PORT = process.env.PORT || 3000;

const appServer = app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

module.exports = { app, appServer };