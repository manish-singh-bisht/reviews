const express = require("express");
const {
  register,
  login,
  logout,
  getUserDetails,
} = require("../controllers/userController");
const { checkSchema } = require("express-validator");
const {
  registerValidationSchema,
  loginValidationSchema,
} = require("../utils/validations");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

router.post("/users/register", checkSchema(registerValidationSchema), register);
router.post("/users/login", checkSchema(loginValidationSchema), login);
router.post("/users/logout", isAuthenticated, logout);
router.get("/users/details", isAuthenticated, getUserDetails);

module.exports = router;
