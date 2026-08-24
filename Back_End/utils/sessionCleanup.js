const Session = require("../models/session.model");
const { Doctor } = require("../models/User");

const expirePendingSessions = async () => {
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const now = new Date();

    // Find sessions in "pending" status where:
    // 1. depositPaid is false AND they were created more than 15 minutes ago
    // 2. OR scheduledTime is in the past (outdated session request)
    const expiredSessions = await Session.find({
      status: "pending",
      $or: [
        { depositPaid: false, createdAt: { $lt: fifteenMinutesAgo } },
        { scheduledTime: { $lt: now } }
      ]
    });

    if (expiredSessions.length > 0) {
      console.log(`[Cleanup] Found ${expiredSessions.length} pending sessions to expire.`);
    }

    for (const session of expiredSessions) {
      session.status = "cancelled";
      await session.save();

      // Release the slot if the session had a slot reserved
      if (session.slotId) {
        await Doctor.updateOne(
          { _id: session.doctorId, "slots._id": session.slotId },
          { $set: { "slots.$.isBooked": false } }
        );
        console.log(`[Cleanup] Released slot ${session.slotId} for Doctor ${session.doctorId} because Session ${session._id} expired.`);
      }
    }
  } catch (error) {
    console.error("[Cleanup] Error during pending sessions cleanup:", error);
  }
};

const startSessionCleanup = (intervalMs = 60000) => {
  console.log(`[Cleanup] Initializing pending session expiration task, interval: ${intervalMs / 1000}s`);
  // Run once immediately
  expirePendingSessions();
  // Schedule periodic execution
  setInterval(expirePendingSessions, intervalMs);
};

module.exports = {
  expirePendingSessions,
  startSessionCleanup
};
