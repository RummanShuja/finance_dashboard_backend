const Record = require("../models/Record");
const asyncHandler = require("../utils/asyncHandler");

const getSummary = asyncHandler(async (req, res) => {
  const match = {};

  if (req.query.startDate || req.query.endDate) {
    match.date = {};

    if (req.query.startDate) {
      match.date.$gte = new Date(req.query.startDate);
    }

    if (req.query.endDate) {
      match.date.$lte = new Date(req.query.endDate);
    }
  }

  const [totals, categoryTotals, recentActivity, monthlyTrend] = await Promise.all([
    Record.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]),
    Record.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } }
    ]),
    Record.find(match).populate("createdBy", "name email role").sort({ date: -1 }).limit(5),
    Record.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ])
  ]);

  const totalIncome = totals.find((item) => item._id === "income")?.total || 0;
  const totalExpenses = totals.find((item) => item._id === "expense")?.total || 0;
  const trendMap = new Map();

  monthlyTrend.forEach((item) => {
    const label = `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;

    if (!trendMap.has(label)) {
      trendMap.set(label, {
        month: label,
        income: 0,
        expense: 0
      });
    }

    trendMap.get(label)[item._id.type] = item.total;
  });

  res.status(200).json({
    success: true,
    data: {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      categoryTotals: categoryTotals.map((item) => ({
        category: item._id,
        total: item.total
      })),
      recentActivity,
      monthlyTrend: Array.from(trendMap.values())
    }
  });
});

module.exports = {
  getSummary
};
