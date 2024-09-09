const express = require("express");
const { checkSchema } = require("express-validator");
const {
  spaceValidationSchema,
  spaceIdValidationSchema,
  userIdValidationSchema,
  spaceNameValidationSchema,
} = require("../utils/validations");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  addSpace,
  editSpace,
  deleteSpace,
  getSpacesForUser,
  getSpaceById,
  getSpaceByNameForReview,
} = require("../controllers/spaceController");

const router = express.Router();

router.post(
  "/spaces",
  isAuthenticated,
  checkSchema(spaceValidationSchema),
  addSpace
);
router.put(
  "/spaces/:id",
  isAuthenticated,
  checkSchema(spaceValidationSchema),
  checkSchema(spaceIdValidationSchema),
  editSpace
);
router.delete(
  "/spaces/:id",
  isAuthenticated,
  checkSchema(spaceIdValidationSchema),
  deleteSpace
);
router.get(
  "/spaces/users", //user id
  isAuthenticated,
  getSpacesForUser
);
router.get(
  "/spaces/:id",
  checkSchema(spaceIdValidationSchema),
  isAuthenticated,
  getSpaceById
);
router.get(
  "/spaces/reviews/:name",
  checkSchema(spaceNameValidationSchema),
  getSpaceByNameForReview
);

module.exports = router;
