const Chart = require("../schema/detailsSchema");
const moment = require("moment");
const mongoose = require("mongoose");
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

  const currentMonth = moment().month() + 1; // 1–12

  // Step 1: Fetch all data for that year grouped by month
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
        _id: { month: "$month" },
        income: {
          $sum: { $cond: [{ $eq: ["$type", "income"] }, "$price", 0] },
        },
        savings: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ["$type", "savings"] }, { $ne: ["$category", "emergency fund"] }] },
              "$price",
              0,
            ],
          },
        },
        emergencyFund: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ["$type", "savings"] }, { $eq: ["$category", "emergency fund"] }] },
              "$price",
              0,
            ],
          },
        },
        expense: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ["$type", "expense"] }, { $ne: ["$category", "give loan"] }] },
              "$price",
              0,
            ],
          },
        },
        loanGiven: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ["$type", "expense"] }, { $eq: ["$category", "give loan"] }] },
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
        month: "$_id.month",
        income: 1,
        savings: 1,
        emergencyFund: 1,
        expense: 1,
        loanGiven: 1,
      },
    },
    { $sort: { month: 1 } },
  ]);

  // Step 2: Format data for all months (always 12 entries)
  const months = moment.monthsShort(); // ["Jan", "Feb", ...]
  let openBalance = 0;

  const monthlyReport = months.map((m, i) => {
    const monthNum = i + 1;

    // only allow data till current month, else zero
    const monthData =
      monthNum <= currentMonth
        ? result.find(r => r.month === monthNum) || {
            income: 0,
            savings: 0,
            emergencyFund: 0,
            expense: 0,
            loanGiven: 0,
          }
        : {
            income: 0,
            savings: 0,
            emergencyFund: 0,
            expense: 0,
            loanGiven: 0,
          };

    const closingBalance =
      monthNum <= currentMonth
        ? openBalance +
          monthData.income -
          (monthData.savings +
            monthData.expense +
            monthData.emergencyFund +
            monthData.loanGiven)
        : 0;

    const report = {
      month: m,
      openBalance: monthNum <= currentMonth ? openBalance : 0,
      income: monthData.income,
      savings: monthData.savings,
      expense: monthData.expense,
      emergencyFund: monthData.emergencyFund,
      loanGiven: monthData.loanGiven,
      closingBalance,
    };

    // only carry forward balance if this month is before/equal current
    if (monthNum <= currentMonth) {
      openBalance = closingBalance;
    }

    return report;
  });

  return res.status(200).json({ data: monthlyReport, message: "success" });
};



module.exports = { getChartDetails, getOverView , getYearlyReport};
