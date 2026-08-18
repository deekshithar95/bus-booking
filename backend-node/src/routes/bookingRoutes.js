const express = require("express");

const {
  getAvailableSeats,
  createBooking
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

router.post(
  "/",
  protect,
  createBooking
);

module.exports = router;