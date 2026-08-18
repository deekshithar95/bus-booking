const Booking = require("../models/Booking");

exports.getAvailableSeats = async (req, res) => {
  try {

    const { scheduleId } = req.params;

    const seats = await Booking.getAvailableSeats(scheduleId);

    res.json({
      scheduleId,
      seats
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch available seats"
    });

  }
};


exports.createBooking = async (req, res) => {

  try {

    const userId = req.user.id;

    const {
      scheduleId,
      seatIds,
      totalAmount
    } = req.body;

    // Validate schedule
    if (!scheduleId) {
      return res.status(400).json({
        message: "scheduleId is required"
      });
    }

    // Validate seats
    if (
      !Array.isArray(seatIds) ||
      seatIds.length === 0
    ) {
      return res.status(400).json({
        message: "At least one seat is required"
      });
    }

    // Validate amount
    if (
      totalAmount === undefined ||
      totalAmount <= 0
    ) {
      return res.status(400).json({
        message: "Valid totalAmount is required"
      });
    }

    const booking = await Booking.createBooking({
      userId,
      scheduleId,
      seatIds,
      totalAmount
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking
    });

  } catch (error) {

    console.error(error);

    if (
      error.message.includes("already booked")
    ) {

      return res.status(409).json({
        message: error.message
      });

    }

    res.status(500).json({
      message: error.message || "Booking failed"
    });

  }

};