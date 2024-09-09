const registerValidationSchema = {
  email: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Invalid email",
    },

    trim: true,
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Password is required",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },

    trim: true,
  },
};
const loginValidationSchema = {
  email: {
    notEmpty: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Invalid email",
    },

    trim: true,
  },
  password: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Password is required",
    },
    trim: true,
  },
};

const spaceValidationSchema = {
  name: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Name is required",
    },
    isLength: {
      options: { min: 1, max: 30 },
      errorMessage: "Name must be between 1 and 30 characters long",
    },
    trim: true,
  },
  headerTitle: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Title is required",
    },
    isLength: {
      options: { min: 1, max: 50 },
      errorMessage: "Title must be between 1 and 50 characters long",
    },
  },
  logo: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Logo URL is required",
    },
  },
  customMessage: {
    in: ["body"],
    isLength: {
      options: { max: 150 },
      errorMessage: "Custom message must be less than 150 characters long",
    },
  },
  questions: {
    in: ["body"],
    isArray: {
      errorMessage: "Questions must be an array",
    },
    custom: {
      options: (questions) => questions.length === 5,
      errorMessage: "Exactly 5 questions are required",
    },
    custom: {
      options: (questions) =>
        questions.every((question) => question.length <= 100),
      errorMessage: "Each question must be less than 100 characters long",
    },
  },

  customButtonColor: {
    in: ["body"],
    matches: {
      options: /^#[0-9A-F]{6}$/i,
      errorMessage: "Invalid hex color code for custom button color",
    },
  },
  theme: {
    in: ["body"],
    isIn: {
      options: [["light", "dark"]],
      errorMessage: "Theme must be either 'light' or 'dark'",
    },
  },
  thankYouPage: {
    in: ["body"],
    isObject: {
      errorMessage: "Thank you page must be a valid JSON object",
    },
  },
};

const spaceIdValidationSchema = {
  id: {
    in: ["params"],
    notEmpty: {
      errorMessage: "Space ID is required",
    },
    isUUID: {
      errorMessage: "Invalid space ID",
    },
  },
};
const userIdValidationSchema = {
  id: {
    in: ["params"],
    notEmpty: {
      errorMessage: "User ID is required",
    },
    isUUID: {
      errorMessage: "Invalid user ID",
    },
  },
};
const spaceNameValidationSchema = {
  name: {
    in: ["params"],
    notEmpty: {
      errorMessage: "Name is required",
    },
    isLength: {
      options: { min: 1, max: 30 },
      errorMessage: "Name must be between 1 and 30 characters long",
    },
  },
};
const createReviewValidationSchema = {
  rating: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Rating is required",
    },
    isInt: {
      options: { min: 1, max: 5 },
      errorMessage: "Rating must be an integer between 1 and 5",
    },
  },
  name: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Name is required",
    },
    isLength: {
      options: { max: 100 },
      errorMessage: "Name must be less than 100 characters",
    },
    trim: true,
  },
  email: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Invalid email address",
    },
    trim: true,
  },
  reviewMsg: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Review message is required",
    },
    isLength: {
      options: { min: 30, max: 400 },
      errorMessage:
        "Review message must be more than 30 and less than 400 characters",
    },
    trim: true,
  },
  spaceName: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Space ID is required",
    },
    isLength: {
      options: { min: 1, max: 30 },
      errorMessage: "Name must be between 1 and 30 characters long",
    },
  },
};

const updateReviewValidationSchema = {
  rating: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Rating is required",
    },
    isInt: {
      options: { min: 1, max: 5 },
      errorMessage: "Rating must be an integer between 1 and 5",
    },
  },
  name: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Name is required",
    },
    isLength: {
      options: { max: 100 },
      errorMessage: "Name must be less than 100 characters",
    },
    trim: true,
  },
  email: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Invalid email address",
    },
    trim: true,
  },
  reviewMsg: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Review message is required",
    },
    isLength: {
      options: { max: 500 },
      errorMessage: "Review message must be less than 500 characters",
    },
    trim: true,
  },
  isAmongTop: {
    in: ["body"],
    notEmpty: {
      errorMessage: "isAmongTop is required",
    },

    isBoolean: {
      errorMessage: "isAmongTop must be a boolean value",
    },
  },
  reviewId: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Review ID is required",
    },
    isUUID: {
      errorMessage: "Invalid Space ID",
    },
  },
};

module.exports = {
  registerValidationSchema,
  loginValidationSchema,
  spaceValidationSchema,
  spaceIdValidationSchema,
  createReviewValidationSchema,
  updateReviewValidationSchema,
  userIdValidationSchema,
  spaceNameValidationSchema,
};
