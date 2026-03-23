module.exports = function authorize(...allowedRoles) {
  return function authorizeMiddleware(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!allowedRoles.length || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ error: "You do not have access to this resource" });
  };
};
