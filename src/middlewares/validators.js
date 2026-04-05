const { body, param, query } = require("express-validator");

const roleValues = ["viewer", "analyst", "admin"];
const statusValues = ["active", "inactive"];
const recordTypes = ["income", "expense"];

const loginValidator = [
  body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required")
];

const createUserValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(roleValues)
    .withMessage(`Role must be one of: ${roleValues.join(", ")}`),
  body("status")
    .optional()
    .isIn(statusValues)
    .withMessage(`Status must be one of: ${statusValues.join(", ")}`)
];

const updateUserValidator = [
  param("id").isMongoId().withMessage("id must be a valid id"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email").optional().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(roleValues)
    .withMessage(`Role must be one of: ${roleValues.join(", ")}`),
  body("status")
    .optional()
    .isIn(statusValues)
    .withMessage(`Status must be one of: ${statusValues.join(", ")}`)
];

const createRecordValidator = [
  body("amount").isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),
  body("type")
    .isIn(recordTypes)
    .withMessage(`Type must be one of: ${recordTypes.join(", ")}`),
  body("category")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters"),
  body("date").isISO8601().withMessage("Date must be a valid ISO date").toDate(),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 250 })
    .withMessage("Notes cannot exceed 250 characters")
];

const updateRecordValidator = [
  param("id").isMongoId().withMessage("id must be a valid id"),
  body("amount").optional().isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),
  body("type")
    .optional()
    .isIn(recordTypes)
    .withMessage(`Type must be one of: ${recordTypes.join(", ")}`),
  body("category")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters"),
  body("date").optional().isISO8601().withMessage("Date must be a valid ISO date").toDate(),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 250 })
    .withMessage("Notes cannot exceed 250 characters")
];

const listRecordsValidator = [
  query("type")
    .optional()
    .isIn(recordTypes)
    .withMessage(`Type must be one of: ${recordTypes.join(", ")}`),
  query("category").optional().trim().notEmpty().withMessage("category cannot be empty"),
  query("startDate").optional().isISO8601().withMessage("startDate must be a valid date"),
  query("endDate").optional().isISO8601().withMessage("endDate must be a valid date"),
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100")
];

const recordIdValidator = [param("id").isMongoId().withMessage("id must be a valid id")];

const dashboardQueryValidator = [
  query("startDate").optional().isISO8601().withMessage("startDate must be a valid date"),
  query("endDate").optional().isISO8601().withMessage("endDate must be a valid date")
];

module.exports = {
  loginValidator,
  createUserValidator,
  updateUserValidator,
  createRecordValidator,
  updateRecordValidator,
  listRecordsValidator,
  recordIdValidator,
  dashboardQueryValidator
};
