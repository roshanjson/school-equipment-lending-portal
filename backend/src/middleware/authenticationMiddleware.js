const jwt = require("jsonwebtoken");
const Token = require("../models/Token");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Access denied. No token provided." });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const storedToken = await Token.findOne({ where: { token } });
    if (!storedToken) return res.status(401).json({ error: "Token invalid or expired" });

    req.user = decoded;
    next();
  } 
  catch (err) 
  {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
