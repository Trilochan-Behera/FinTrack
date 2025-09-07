const Chart = require("../schema/detailsSchema");
const FinancialYearBalance = require("../schema/financialYearBalanceSchema");
const moment = require("moment");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types; // Import ObjectId directly from mongoose.Types

// Helper: get financial year start/end for a given year (April–March)
const getFinancialYearRange = (year) => {
  const start = moment(`${year}-04-01`).startOf("day").toDate(); // April 1
  const end = moment(`${year + 1}-03-31`)
    .endOf("day")
    .toDate(); // Next year March 31
  return { start, end };
};

const calculateAllFinancialYears = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ message: "Missing userId" });

    // 1. Find the first year the user has data
    const firstRecord = await Chart.findOne({
      user: new ObjectId(userId),
    }).sort({ year: 1 }); // pick earliest year

    console.log(firstRecord, "firstRecord");

    if (!firstRecord) {
      return res
        .status(404)
        .json({ message: "No chart data found for this user" });
    }

    const firstYear = firstRecord.year; // start from user's first year
    const currentYear = moment().year();

    let year = firstYear;
    let lastClosingBalance = 0;
    const allRecords = [];

    let fyStartYear = year;
    let fyEndYear = year + 1;

    while (fyStartYear <= currentYear) {
      const result = await Chart.aggregate([
        {
          $match: {
            type: { $in: ["income", "savings", "expense"] },
            user: new ObjectId(userId),
            $or: [
              { year: fyStartYear, month: { $gte: 4 } }, // Apr–Dec of start year
              { year: fyEndYear, month: { $lte: 3 } }, // Jan–Mar of next year
            ],
          },
        },
        {
          $group: {
            _id: null,
            income: {
              $sum: { $cond: [{ $eq: ["$type", "income"] }, "$price", 0] },
            },
            savings: {
              $sum: { $cond: [{ $eq: ["$type", "savings"] }, "$price", 0] },
            },
            expense: {
              $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$price", 0] },
            },
          },
        },
      ]);

      let income = 0,
        savings = 0,
        expense = 0;

      console.log(result, "resukt");

      if (result.length > 0) {
        income = result[0].income;
        savings = result[0].savings;
        expense = result[0].expense;
      }

      const closingBalance = lastClosingBalance + income - (savings + expense);

      // Upsert into FinancialYearBalance
      const record = await FinancialYearBalance.findOneAndUpdate(
        {
          user: new ObjectId(userId),
          financialYearStart: fyStartYear,
          financialYearEnd: fyEndYear,
        }, // filter (identifies the row)
        {
          $set: {
            user: new ObjectId(userId),
            financialYearStart: fyStartYear,
            financialYearEnd: fyEndYear,
            openingBalance: lastClosingBalance,
            closingBalance,
          },
        },
        { upsert: true, new: true }
      );

      console.log(
        allRecords,
        closingBalance,
        fyStartYear,
        lastClosingBalance,
        "record"
      );

      allRecords.push(record);

      lastClosingBalance = closingBalance;
      fyStartYear++;
      fyEndYear++;
    }

    return res.status(200).json({
      message: "Financial year balances calculated successfully",
      data: allRecords,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error calculating balances", error: error.message });
  }
};

module.exports = {
  calculateAllFinancialYears,
};
