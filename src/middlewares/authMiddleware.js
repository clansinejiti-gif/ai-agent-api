function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      success: "false",
      error: "Authentication Required",
    });
  }
  next();
}

export default requireAuth;
