const express = require("express");
const { checkSchema } = require("express-validator");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  createReviewValidationSchema,
  updateReviewValidationSchema,
  spaceIdValidationSchema,
} = require("../utils/validations");
const {
  createReview,
  editReview,
  getAllReviews,
} = require("../controllers/reviewController");
const { validateApiKey } = require("../middlewares/apiKeyValidation");

const router = express.Router();

router.post(
  "/reviews",
  checkSchema(createReviewValidationSchema),
  createReview
);
router.put(
  "/reviews/:id",
  isAuthenticated,
  checkSchema(spaceIdValidationSchema), //it is review id ,but validation is same .
  editReview
);

router.get(
  "/:id/reviews", //space id
  isAuthenticated,
  checkSchema(spaceIdValidationSchema),
  getAllReviews
);

module.exports = router;
