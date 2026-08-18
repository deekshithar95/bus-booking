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