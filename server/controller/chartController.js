const Chart = require("../schema/detailsSchema");
const moment = require("moment");
const mongoose = require("mongoose");
const financialYearBalanceSchema = require("../schema/financialYearBalanceSchema");
const { ObjectId } = mongoose.Types; // Import ObjectId directly from mongoose.Types

const getChartDetails = async (req, res) => {
  let { type, selectType, year, month } = req.query;

  if (selectType === "date") {
    month = Number(month) || moment().month() + 1;
    year = Number(year) || moment().year();

    // Aggregate data directly in the database query
    const result = await Chart.aggregate([
      {
        $match: {
          type: type,
          year: year,
          month: month,
          user: new ObjectId(req.userId),
        },
      },
      {
        $group: {
          _id: "$date",
          price: { $sum: "$price" },
        },
      },
      {
        $project: {
          date: "$_id",
          price: 1,
          _id: 0,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);
    return res.status(200).json({ data: result, message: "success" });
  } else if (selectType === "month") {
    if (!type || type === "all") {
      return res.status(400).json({ message: "Invalid request" });
    }
    year = Number(year) || moment().year();
    // Aggregate data directly in the database query
    const result = await Chart.aggregate([
      {
        $match: { type: type, year: year, user: new ObjectId(req.userId) },
      },
      {
        $group: {
          _id: "$month",
          totalPrice: { $sum: "$price" },
        },
      },
      {
        $project: {
          month: "$_id",
          totalPrice: 1,
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);
    const finalResult = Array.from({ length: 12 }, (_, index) => {
      const matchingMonth = result.find((res) => res.month === index + 1);
      return matchingMonth ? matchingMonth.totalPrice : 0;
    });

    return res.status(200).json({ data: finalResult, message: "success" });
  } else if (selectType === "categoryName") {
    if (!type || type === "all") {
      return res.status(400).json({ message: "Invalid request" });
    }
    month = Number(month) || moment().month() + 1;
    year = Number(year) || moment().year();
    const result = await Chart.aggregate([
      {
        $match: {
          type: type,
          year: year,
          month: month,
          user: new ObjectId(req.userId),
        },
      },
      {
        $group: {
          _id: "$category",
          price: { $sum: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          categoryName: { $toString: "$_id" },
          price: 1,
        },
      },
      {
        $sort: { categoryName: 1 },
      },
    ]);
    return res.status(200).json({ data: result, message: "success" });
  } else if (type === "all") {
    year = Number(year) || moment().year();
    const result = await Chart.aggregate([
      {
        $match: {
          type: { $in: ["income", "savings", "expense"] },
          year: year,
          user: new ObjectId(req.userId),
        },
      },
      {
        $group: {
          _id: { type: "$type", month: "$month" },
          totalPrice: { $sum: "$price" },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          data: {
            $push: {
              k: "$_id.type",
              v: "$totalPrice",
            },
          },
        },
      },
      {
        $project: {
          month: "$_id",
          data: { $arrayToObject: "$data" },
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);
    return res.status(200).json({ data: result, message: "success" });
  } else if (type === "calendar") {
    year = Number(year) || moment().year();
    month = Number(month) || moment().month() + 1;
    const result = await Chart.aggregate([
      {
        $match: {
          type: { $in: ["income", "savings", "expense"] },
          year: year,
          month: month,
          user: new ObjectId(req.userId),
        },
      },
      {
        $group: {
          _id: { type: "$type", date: "$date" },
          totalPrice: { $sum: "$price" },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          data: {
            $push: {
              k: "$_id.type",
              v: "$totalPrice",
            },
          },
        },
      },
      {
        $project: {
          date: "$_id",
          data: { $arrayToObject: "$data" },
          _id: 0,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);
    return res.status(200).json({ data: result, message: "success" });
  } else {
    return res.status(400).json({ message: "Invalid request" });
  }
};

const getOverView = async (req, res) => {
  let { year } = req.query;
  year = Number(year) || moment().year();
  month = moment().month() + 1;
  const result = await Chart.aggregate([
    {
      $match: {
        type: { $in: ["income", "savings", "expense"] },
        year: year,
        month: month,
        user: new ObjectId(req.userId),
      },
    },
    {
      $group: {
        _id: "$type",
        totalPrice: { $sum: "$price" },
      },
    },
    {
      $project: {
        type: "$_id",
        totalPrice: 1,
        _id: 0,
      },
    },
    {
      $sort: { type: 1 },
    },
  ]);

  return res.status(200).json({ data: result, message: "success" });
};

const getYearlyReport = async (req, res) => {
  let { year } = req.query;
  year = Number(year) || moment().year();

  // FY starts in April of given year → ends in March of next year
  const fyStartYear = year;
  const fyEndYear = year + 1;

  const prevFY = await financialYearBalanceSchema.findOne({
    user: new ObjectId(req.userId),
    financialYearStart: year - 1,
    financialYearEnd: year,
  });

  const prevMarchBalance = prevFY ? prevFY.closingBalance : 0;

  // Step 1: Fetch Apr–Mar data for given FY
  const result = await Chart.aggregate([
    {
      $match: {
        type: { $in: ["income", "savings", "expense"] },
        user: new ObjectId(req.userId),
        $or: [
          { year: fyStartYear, month: { $gte: 4 } }, // Apr–Dec of start year
          { year: fyEndYear, month: { $lte: 3 } }, // Jan–Mar of next year
        ],
      },
    },
    {
      $group: {
        _id: { year: "$year", month: "$month" },
        income: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$price", 0] },
        },
        savings: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$type", "savings"] },
                  { $ne: ["$category", "emergency fund"] },
                ],
              },
              "$price",
              0,
            ],
          },
        },
        emergencyFund: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$type", "savings"] },
                  { $eq: ["$category", "emergency fund"] },
                ],
              },
              "$price",
              0,
            ],
          },
        },
        expense: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$type", "expense"] },
                  { $ne: ["$category", "give loan"] },
                ],
              },
              "$price",
              0,
            ],
          },
        },
        loanGiven: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$type", "expense"] },
                  { $eq: ["$category", "give loan"] },
                ],
              },
              "$price",
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        income: 1,
        savings: 1,
        emergencyFund: 1,
        expense: 1,
        loanGiven: 1,
      },
    },
    { $sort: { year: 1, month: 1 } },
  ]);

  // Step 2: Prepare Apr–Mar sequence
  const months = Array.from(
    { length: 12 },
    (_, i) =>
      moment()
        .month((i + 3) % 12)
        .format("MMM") // 3 = April (0-indexed)
  );

  // 🚀 initialize with previous March balance
  let openBalance = prevMarchBalance;

  const monthlyReport = months.map((m, i) => {
    const monthNum = (i + 4) % 12 || 12; // Apr=4 … Mar=3
    const monthYear = monthNum >= 4 ? fyStartYear : fyEndYear;

    const monthData = result.find(
      (r) => r.year === monthYear && r.month === monthNum
    ) || {
      income: 0,
      savings: 0,
      emergencyFund: 0,
      expense: 0,
      loanGiven: 0,
    };

    const closingBalance =
      openBalance +
      monthData.income -
      (monthData.savings +
        monthData.expense +
        monthData.emergencyFund +
        monthData.loanGiven);

    const currentYear = moment().year();
    const currentMonth = moment().month() + 1; // 1–12

    const report = {
      month: m,
      openBalance:
        monthYear === currentYear && monthNum <= currentMonth ? openBalance : 0,
      income: monthData.income,
      savings: monthData.savings,
      expense: monthData.expense,
      emergencyFund: monthData.emergencyFund,
      loanGiven: monthData.loanGiven,
      closingBalance:
        monthYear === currentYear && monthNum <= currentMonth
          ? closingBalance
          : 0,
    };

    openBalance = closingBalance; // carry forward

    return report;
  });

  return res.status(200).json({ data: monthlyReport, message: "success" });
};

module.exports = { getChartDetails, getOverView, getYearlyReport };
