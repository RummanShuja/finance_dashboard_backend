const Record = require("../models/Record");
const asyncHandler = require("../utils/asyncHandler");

const createRecord = asyncHandler(async (req, res) => {
  const record = await Record.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.status(201).json({
    success: true,
    message: "Record created successfully",
    data: record
  });
});

const listRecords = asyncHandler(async (req, res) => {
  const filter = {};
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (req.query.type) {
    filter.type = req.query.type;
  }

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.startDate || req.query.endDate) {
    filter.date = {};

    if (req.query.startDate) {
      filter.date.$gte = new Date(req.query.startDate);
    }

    if (req.query.endDate) {
      filter.date.$lte = new Date(req.query.endDate);
    }
  }

  const [records, totalRecords] = await Promise.all([
    Record.find(filter).populate("createdBy", "name email role").sort({ date: -1 }).skip(skip).limit(limit),
    Record.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    data: records,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit)
    }
  });
});

const getRecordById = asyncHandler(async (req, res) => {
  const record = await Record.findById(req.params.id).populate("createdBy", "name email role");

  if (!record) {
    res.status(404);
    throw new Error("Record not found");
  }

  res.status(200).json({
    success: true,
    data: record
  });
});

const updateRecord = asyncHandler(async (req, res) => {
  const record = await Record.findById(req.params.id);

  if (!record) {
    res.status(404);
    throw new Error("Record not found");
  }

  if (req.body.amount !== undefined) record.amount = req.body.amount;
  if (req.body.type !== undefined) record.type = req.body.type;
  if (req.body.category !== undefined) record.category = req.body.category;
  if (req.body.date !== undefined) record.date = req.body.date;
  if (req.body.notes !== undefined) record.notes = req.body.notes;

  await record.save();

  res.status(200).json({
    success: true,
    message: "Record updated successfully",
    data: record
  });
});

const deleteRecord = asyncHandler(async (req, res) => {
  const record = await Record.findById(req.params.id);

  if (!record) {
    res.status(404);
    throw new Error("Record not found");
  }

  await record.deleteOne();

  res.status(200).json({
    success: true,
    message: "Record deleted successfully"
  });
});

module.exports = {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord
};
