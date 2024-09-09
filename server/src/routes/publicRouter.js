const express = require("express");
const { checkSchema } = require("express-validator");
const { spaceNameValidationSchema } = require("../utils/validations");
const { validateApiKey } = require("../middlewares/apiKeyValidation");
const {
  getAllReviewsWhenRequestedByUser,
} = require("../controllers/publicReviewController");

const router = express.Router();

router.get(
  "/spaces/:name/reviews", //space name
  validateApiKey,
  checkSchema(spaceNameValidationSchema),
  getAllReviewsWhenRequestedByUser
);

module.exports = router;
