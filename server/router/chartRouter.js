const express = require("express");
const {
  getChartDetails,
  getOverView,
  getYearlyReport
} = require("../controller/chartController");
const verify = require("../middleware/verifyToken"); /// Add middleware to the routes

const router = express.Router();

router.get("/chart", verify, getChartDetails);
router.get("/chart-overview", verify, getOverView);
router.get("/yearly-report", verify, getYearlyReport);

module.exports = router;
