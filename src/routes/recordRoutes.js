const express = require("express");

const {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord
} = require("../controllers/recordController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
  createRecordValidator,
  updateRecordValidator,
  listRecordsValidator,
  recordIdValidator
} = require("../middlewares/validators");

const router = express.Router();

router.use(protect);

router.get("/", authorize("admin", "analyst"), listRecordsValidator, validateRequest, listRecords);
router.get("/:id", authorize("admin", "analyst"), recordIdValidator, validateRequest, getRecordById);
router.post("/", authorize("admin"), createRecordValidator, validateRequest, createRecord);
router.patch("/:id", authorize("admin"), updateRecordValidator, validateRequest, updateRecord);
router.delete("/:id", authorize("admin"), recordIdValidator, validateRequest, deleteRecord);

module.exports = router;
