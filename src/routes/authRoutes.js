const express = require("express");

const { login, getCurrentUser } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const { loginValidator } = require("../middlewares/validators");

const router = express.Router();

router.post("/login", loginValidator, validateRequest, login);
router.get("/me", protect, getCurrentUser);

module.exports = router;

