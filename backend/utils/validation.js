const joi = require("joi");

// Define register validation schema
const userSchema = joi.object({
  name: joi.string().min(20).max(60).required().messages({
    "string.min": "Name must be at least 20 characters",
    "string.max": "Name cannot exceed 60 characters",
    "any.required": "Name is required",
  }),

  email: joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  password: joi
    .string()
    .min(8)
    .max(16)
    .pattern(/[A-Z]/)
    .pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password cannot exceed 16 characters",
      "string.pattern.base":
        "Password must include at least one uppercase letter and one special character",
      "any.required": "Password is required",
    }),

  address: joi.string().max(400).allow("").optional().messages({
    "string.max": "Address cannot exceed 400 characters",
  }),

  role: joi.string().valid("user", "owner", "admin").default("user").optional(),
});

// Define login validation schema
const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  password: joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

// Define store validation schema
const storeSchema = joi.object({
  name: joi.string().min(3).max(100).required().messages({
    "string.min": "Store name must be at least 3 characters",
    "string.max": "Store name cannot exceed 100 characters",
    "any.required": "Store name is required",
  }),

  email: joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  address: joi.string().max(400).required().messages({
    "string.max": "Address cannot exceed 400 characters",
    "any.required": "Address is required",
  }),

  ownerId: joi.number().positive().required().messages({
    "number.positive": "Owner ID must be a positive number",
    "any.required": "Owner ID is required",
  }),
});

// Define password update validation schema
const passwordSchema = joi.object({
  oldPassword: joi.string().required().min(8).messages({
    "string.empty": "Old password is required",
    "string.min": "Old password must be at least 8 characters",
  }),
  newPassword: joi
    .string()
    .required()
    .min(8)
    .pattern(/[A-Z]/)
    .pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .max(16)
    .messages({
      "string.empty": "New password is required",
      "string.min": "New password must be at least 8 characters",
      "string.max": "New password cannot exceed 16 characters",
      "string.pattern.base":
        "New password must include at least one uppercase letter and one special character",
    }),
});

// Define rating validation schema
const ratingSchema = joi.object({
  storeId: joi.number().integer().positive().messages({
    "number.base": "Store ID must be a number",
    "number.positive": "Store ID must be positive",
  }),
  rating: joi.number().integer().min(1).max(5).required().messages({
    "number.base": "Rating must be a number",
    "number.min": "Rating must be at least 1",
    "number.max": "Rating must not exceed 5",
    "any.required": "Rating is required",
  }),
});

// Middleware for joi validation
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      }));

      return res.status(400).json({ errors });
    }

    // Replace req.body with validated value
    req.body = value;
    next();
  };
};

module.exports = {
  validate,
  userSchema,
  loginSchema,
  storeSchema,
  passwordSchema,
  ratingSchema,
};
