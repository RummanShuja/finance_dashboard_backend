require("dotenv").config();

const connectDB = require("./config/db");
const User = require("./models/User");
const Record = require("./models/Record");

const demoUsers = [
  {
    name: "System Admin",
    email: "admin@example.com",
    password: "Admin@123",
    role: "admin",
    status: "active"
  },
  {
    name: "Riya Analyst",
    email: "analyst@example.com",
    password: "Analyst@123",
    role: "analyst",
    status: "active"
  },
  {
    name: "Vikram Viewer",
    email: "viewer@example.com",
    password: "Viewer@123",
    role: "viewer",
    status: "active"
  }
];

const demoRecords = [
  { amount: 50000, type: "income", category: "Salary", date: "2026-01-05", notes: "Demo seed: January salary" },
  { amount: 8000, type: "income", category: "Freelance", date: "2026-01-18", notes: "Demo seed: Landing page project" },
  { amount: 12000, type: "expense", category: "Rent", date: "2026-01-07", notes: "Demo seed: Monthly rent" },
  { amount: 3500, type: "expense", category: "Groceries", date: "2026-01-11", notes: "Demo seed: Household shopping" },
  { amount: 2200, type: "expense", category: "Internet", date: "2026-01-20", notes: "Demo seed: WiFi bill" },
  { amount: 50000, type: "income", category: "Salary", date: "2026-02-05", notes: "Demo seed: February salary" },
  { amount: 10000, type: "income", category: "Bonus", date: "2026-02-14", notes: "Demo seed: Performance bonus" },
  { amount: 12000, type: "expense", category: "Rent", date: "2026-02-07", notes: "Demo seed: Monthly rent" },
  { amount: 4200, type: "expense", category: "Food", date: "2026-02-16", notes: "Demo seed: Outside food and snacks" },
  { amount: 2500, type: "expense", category: "Transport", date: "2026-02-22", notes: "Demo seed: Cab and metro" },
  { amount: 52000, type: "income", category: "Salary", date: "2026-03-05", notes: "Demo seed: March salary" },
  { amount: 7000, type: "income", category: "Freelance", date: "2026-03-19", notes: "Demo seed: API integration project" },
  { amount: 12000, type: "expense", category: "Rent", date: "2026-03-07", notes: "Demo seed: Monthly rent" },
  { amount: 3000, type: "expense", category: "Utilities", date: "2026-03-15", notes: "Demo seed: Electricity and water" },
  { amount: 4500, type: "expense", category: "Shopping", date: "2026-03-24", notes: "Demo seed: Clothes and essentials" },
  { amount: 52000, type: "income", category: "Salary", date: "2026-04-05", notes: "Demo seed: April salary" },
  { amount: 6000, type: "income", category: "Freelance", date: "2026-04-12", notes: "Demo seed: Portfolio website project" },
  { amount: 12000, type: "expense", category: "Rent", date: "2026-04-07", notes: "Demo seed: Monthly rent" },
  { amount: 3200, type: "expense", category: "Food", date: "2026-04-13", notes: "Demo seed: Groceries and snacks" },
  { amount: 1800, type: "expense", category: "Internet", date: "2026-04-17", notes: "Demo seed: Broadband bill" }
];

const upsertUser = async (userData) => {
  let user = await User.findOne({ email: userData.email });

  if (!user) {
    user = await User.create(userData);
    return user;
  }

  user.name = userData.name;
  user.role = userData.role;
  user.status = userData.status;
  await user.save();
  return user;
};

const seedDemoData = async () => {
  try {
    await connectDB();

    const createdUsers = {};
    for (const userData of demoUsers) {
      const user = await upsertUser(userData);
      createdUsers[userData.role] = user;
    }

    await Record.deleteMany({
      notes: { $regex: "^Demo seed:" }
    });

    const recordsToInsert = demoRecords.map((record) => ({
      ...record,
      createdBy: createdUsers.admin._id
    }));

    await Record.insertMany(recordsToInsert);

    console.log("Demo data inserted successfully.");
    console.log("Demo accounts:");
    console.log("Admin   -> admin@example.com / Admin@123");
    console.log("Analyst -> analyst@example.com / Analyst@123");
    console.log("Viewer  -> viewer@example.com / Viewer@123");
    console.log(`Inserted ${recordsToInsert.length} demo records.`);
  } catch (error) {
    console.error("Failed to seed demo data:", error.message);
  } finally {
    process.exit();
  }
};

seedDemoData();
