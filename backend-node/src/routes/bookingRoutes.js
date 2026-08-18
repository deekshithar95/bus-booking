const express = require("express");

const {
  getAvailableSeats
} = require("../controllers/bookingController");

const {
  protect
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/schedule/:scheduleId/seats",
  protect,
  getAvailableSeats
);

module.exports = router;