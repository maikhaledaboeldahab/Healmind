const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model"); // adjust path to your actual User model file

// Runs once per socket connection attempt, BEFORE the connection is accepted.
// Rejects the handshake entirely if the token is missing/invalid, so no
// unauthenticated socket ever reaches your event handlers.
const socketAuthMiddleware = async (socket, next) => {
  try {
    // Client should send the token like:
    // io(URL, { auth: { token: "Bearer <jwt>" } })
    const rawToken =
      socket.handshake.auth?.token || socket.handshake.headers?.authorization;

    if (!rawToken) {
      return next(new Error("Authentication error: token missing."));
    }

    const token = rawToken.startsWith("Bearer ")
      ? rawToken.split(" ")[1]
      : rawToken;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id || decoded._id).select(
      "name role isActive"
    );

    if (!user || !user.isActive) {
      return next(new Error("Authentication error: user not found or inactive."));
    }

    // Attach the authenticated user to the socket for use in all event handlers
    socket.user = user;

    return next();
  } catch (err) {
    return next(new Error("Authentication error: invalid or expired token."));
  }
};

module.exports = socketAuthMiddleware;