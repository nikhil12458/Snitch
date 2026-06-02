import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
}

export const validateRegisterUser = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address"),
  body("contact")
    .trim()
    .notEmpty()
    .withMessage("Contact is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid contact number"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters long"),
  body("isSeller")
    .optional()
    .isBoolean()
    .withMessage("isSeller must be a boolean value"),

  validateRequest,
];

export const validateLoginUser = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validateRequest,
];
