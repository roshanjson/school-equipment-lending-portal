const authorize = (allowedRoles) => (req, res, next) => {
  const user = req.user;

  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({ error: "Forbidden: You don't have permission" });
  }

  next();
};

module.exports = authorize;