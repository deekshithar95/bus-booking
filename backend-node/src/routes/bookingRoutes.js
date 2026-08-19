const express = require("express");

const {
  getAvailableSeats,
  createBooking,
  getMyBookings,
  cancelBooking
} = require("../controllers/bookingController");

const {
  protect
} = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// GET AVAILABLE SEATS
// GET /api/bookings/schedule/:scheduleId/seats
// =====================================================

router.get(
  "/schedule/:scheduleId/seats",
  protect,
  getAvailableSeats
);


// =====================================================
// CREATE BOOKING
// POST /api/bookings
// =====================================================

router.post(
  "/",
  protect,
  createBooking
);


// =====================================================
// GET MY BOOKINGS
// GET /api/bookings/my-bookings
// =====================================================

router.get(
  "/my-bookings",
  protect,
  getMyBookings
);


// =====================================================
// CANCEL BOOKING
// DELETE /api/bookings/:bookingId
// =====================================================

router.delete(
  "/:bookingId",
  protect,
  cancelBooking
);


module.exports = router;