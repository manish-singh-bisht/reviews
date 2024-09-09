const prisma = require("../lib/prisma");

const { ENCRYPTION_KEY_TEXT } = require("../config");
const { decrypt } = require("../utils/jwtUtils");

//i think i did too much in the error message and status code here.
exports.validateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const email = req.headers["email"];

    if (!apiKey) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    if (!email) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const decryptedApiKey = decrypt(apiKey);
    if (decryptedApiKey !== ENCRYPTION_KEY_TEXT) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    const isValidApiKey = apiKey === user.apiKey;
    if (!isValidApiKey) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error validating API key:", error);
    return res.status(500).json({ error: "Invalid credentials." });
  }
};
