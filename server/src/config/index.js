const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  ENCRYPTION_KEY_TEXT: process.env.ENCRYPTION_KEY_TEXT,
  API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUD_NAME: process.env.CLOUDINARY_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
};
