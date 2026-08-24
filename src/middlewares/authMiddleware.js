export default function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      erreor: "Authentication Required",
    });
  }
  next();
}
