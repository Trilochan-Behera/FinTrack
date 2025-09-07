const mongoDB = require("mongoose");

const financialYearBalanceSchema = new mongoDB.Schema(
  {
    user: {
      type: mongoDB.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    financialYearStart: {
      type: Number,
      required: true,
    },
    financialYearEnd: {
      type: Number,
      required: true,
    },
    openingBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    closingBalance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// ✅ Ensure only one record per user per financial year
financialYearBalanceSchema.index(
  { user: 1, financialYearStart: 1, financialYearEnd: 1 },
  { unique: true }
);

module.exports = mongoDB.model(
  "financialYearBalance",
  financialYearBalanceSchema
);
