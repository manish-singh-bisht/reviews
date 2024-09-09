const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET } = require("../config");
const prisma = require("../lib/prisma");

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized, no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token, ACCESS_TOKEN_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized, user not found" });
    }
    const { apiKey, ...userWithoutApiKey } = user;

    // Attach user to the request
    req.user = userWithoutApiKey;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = isAuthenticated;
