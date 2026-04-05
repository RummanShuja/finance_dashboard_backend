const express = require("express");

const { listUsers, createUser, updateUser } = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const { createUserValidator, updateUserValidator } = require("../middlewares/validators");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", listUsers);
router.post("/", createUserValidator, validateRequest, createUser);
router.patch("/:id", updateUserValidator, validateRequest, updateUser);

module.exports = router;

