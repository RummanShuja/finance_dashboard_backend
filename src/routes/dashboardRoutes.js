const express = require("express");

const { getSummary } = require("../controllers/dashboardController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const { dashboardQueryValidator } = require("../middlewares/validators");

const router = express.Router();

router.get(
  "/summary",
  protect,
  authorize("viewer", "analyst", "admin"),
  dashboardQueryValidator,
  validateRequest,
  getSummary
);

module.exports = router;

