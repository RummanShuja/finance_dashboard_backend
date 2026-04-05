const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const listUsers = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.role) {
    filter.role = req.query.role;
  }

  if (req.query.status) {
    filter.status = req.query.status;
  }

  const users = await User.find(filter).select("-password").sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, status } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
    status
  });
  user.password = undefined;
  
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: user
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("+password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (req.user._id.toString() === id && req.body.status === "inactive") {
    res.status(400);
    throw new Error("You cannot deactivate your own account");
  }

  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.email !== undefined) user.email = req.body.email;
  if (req.body.password !== undefined) user.password = req.body.password;
  if (req.body.role !== undefined) user.role = req.body.role;
  if (req.body.status !== undefined) user.status = req.body.status;

  await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
});

module.exports = {
  listUsers,
  createUser,
  updateUser
};
