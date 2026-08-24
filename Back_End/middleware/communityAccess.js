const requireCommunityAccess = (req, res, next) => {
  // Doctor or Admin? Allow access directly
  if (req.user.role !== "patient") {
    return next();
  }

  // Still pending or rejected?
  if (req.user.communityAccess !== "approved") {
    return res.status(403).json({
      success: false,
      message:
        req.user.communityAccess === "rejected"
          ? "Your request to join the community was rejected by the responsible doctor."
          : "Your community access request is still pending. You need approval from the responsible doctor before you can participate in the community.",
      communityAccess: req.user.communityAccess,
    });
  }

  next();
};

module.exports = requireCommunityAccess;
