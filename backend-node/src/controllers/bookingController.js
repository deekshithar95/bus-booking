const Booking = require("../models/Booking");


// =====================================================
// GET AVAILABLE SEATS
// GET /api/bookings/schedule/:scheduleId/seats
// =====================================================

exports.getAvailableSeats = async (req, res) => {

  try {

    const scheduleId =
      Number(req.params.scheduleId);


    // =================================================
    // VALIDATE SCHEDULE ID
    // =================================================

    if (
      !Number.isInteger(scheduleId) ||
      scheduleId <= 0
    ) {

      return res.status(400).json({
        message: "Invalid schedule ID"
      });
    }


    // =================================================
    // GET SEATS
    // =================================================

    const seats =
      await Booking.getAvailableSeats(
        scheduleId
      );


    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({

      scheduleId,

      seats

    });


  } catch (error) {

    console.error(
      "GET AVAILABLE SEATS ERROR:",
      error
    );


    return res.status(500).json({

      message:
        "Failed to fetch available seats"

    });
  }
};



// =====================================================
// CREATE BOOKING
// POST /api/bookings
// =====================================================

exports.createBooking = async (req, res) => {

  try {

    console.log(
      "================================="
    );

    console.log(
      "BOOKING BODY RECEIVED:"
    );

    console.log(req.body);

    console.log(
      "================================="
    );


    // =================================================
    // CHECK USER
    // =================================================

    if (
      !req.user ||
      !req.user.id
    ) {

      return res.status(401).json({

        message:
          "User authentication required"

      });
    }


    const userId =
      Number(req.user.id);


    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {

      return res.status(401).json({

        message:
          "Invalid user"

      });
    }


    // =================================================
    // GET REQUEST DATA
    // =================================================

    const {
      scheduleId,
      seats,
      total_amount
    } = req.body;


    console.log(
      "Schedule ID:",
      scheduleId
    );

    console.log(
      "Seats received:",
      seats
    );

    console.log(
      "Total amount:",
      total_amount
    );


    // =================================================
    // VALIDATE SCHEDULE
    // =================================================

    const numericScheduleId =
      Number(scheduleId);


    if (
      !Number.isInteger(
        numericScheduleId
      ) ||
      numericScheduleId <= 0
    ) {

      return res.status(400).json({

        message:
          "Valid scheduleId is required"

      });
    }


    // =================================================
    // VALIDATE SEATS ARRAY
    // =================================================

    if (
      !Array.isArray(seats) ||
      seats.length === 0
    ) {

      return res.status(400).json({

        message:
          "At least one seat is required"

      });
    }


    // =================================================
    // CONVERT SEATS TO NUMBERS
    // =================================================

    const numericSeats =
      seats.map(
        seat => Number(seat)
      );


    // =================================================
    // VALIDATE SEAT NUMBERS
    // =================================================

    if (
      numericSeats.some(
        seat =>
          !Number.isInteger(seat) ||
          seat <= 0
      )
    ) {

      return res.status(400).json({

        message:
          "Invalid seat number"

      });
    }


    // =================================================
    // REMOVE DUPLICATES
    // =================================================

    const uniqueSeats =
      [
        ...new Set(numericSeats)
      ];


    if (
      uniqueSeats.length !==
      numericSeats.length
    ) {

      return res.status(400).json({

        message:
          "Duplicate seats are not allowed"

      });
    }


    // =================================================
    // VALIDATE TOTAL AMOUNT
    // =================================================

    const numericTotalAmount =
      Number(total_amount);


    if (
      !Number.isFinite(
        numericTotalAmount
      ) ||
      numericTotalAmount <= 0
    ) {

      return res.status(400).json({

        message:
          "Valid total_amount is required"

      });
    }


    // =================================================
    // CREATE BOOKING
    // =================================================

    const booking =
      await Booking.createBooking({

        userId,

        scheduleId:
          numericScheduleId,

        seatIds:
          uniqueSeats,

        totalAmount:
          numericTotalAmount

      });


    // =================================================
    // LOG BOOKING
    // =================================================

    console.log(
      "BOOKING CREATED:"
    );

    console.log(booking);


    // =================================================
    // SUCCESS
    // =================================================

    return res.status(201).json({

      message:
        "Booking created successfully",

      booking

    });


  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "CREATE BOOKING ERROR:"
    );

    console.error(error);

    console.error(
      "================================="
    );


    // =================================================
    // SEAT ALREADY BOOKED
    // =================================================

    if (
      error.message &&
      error.message.includes(
        "already booked"
      )
    ) {

      return res.status(409).json({

        message:
          error.message

      });
    }


    // =================================================
    // INVALID SEAT
    // =================================================

    if (
      error.message &&
      (
        error.message.includes(
          "invalid"
        ) ||
        error.message.includes(
          "Invalid"
        )
      )
    ) {

      return res.status(400).json({

        message:
          error.message

      });
    }


    // =================================================
    // OTHER ERROR
    // =================================================

    return res.status(500).json({

      message:
        error.message ||
        "Booking failed"

    });
  }
};



// =====================================================
// GET MY BOOKINGS
// GET /api/bookings/my-bookings
// =====================================================

exports.getMyBookings = async (req, res) => {

  try {

    console.log(
      "================================="
    );

    console.log(
      "GET MY BOOKINGS"
    );

    console.log(
      "USER:",
      req.user
    );

    console.log(
      "================================="
    );


    // =================================================
    // CHECK USER
    // =================================================

    if (
      !req.user ||
      !req.user.id
    ) {

      return res.status(401).json({

        message:
          "User authentication required"

      });
    }


    const userId =
      Number(req.user.id);


    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {

      return res.status(401).json({

        message:
          "Invalid user"

      });
    }


    // =================================================
    // GET BOOKINGS
    // =================================================

    const bookings =
      await Booking.getBookingsByUser(
        userId
      );


    // =================================================
    // LOG BOOKINGS
    // =================================================

    console.log(
      "MY BOOKINGS:"
    );

    console.log(bookings);


    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({

      bookings

    });


  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "GET MY BOOKINGS ERROR:"
    );

    console.error(error);

    console.error(
      "================================="
    );


    return res.status(500).json({

      message:
        error.message ||
        "Failed to fetch bookings"

    });
  }
};



// =====================================================
// CANCEL BOOKING
// DELETE /api/bookings/:bookingId
// =====================================================

exports.cancelBooking = async (req, res) => {

  try {

    console.log(
      "================================="
    );

    console.log(
      "CANCEL BOOKING"
    );

    console.log(
      "USER:",
      req.user
    );

    console.log(
      "BOOKING ID:",
      req.params.bookingId
    );

    console.log(
      "================================="
    );


    // =================================================
    // CHECK USER
    // =================================================

    if (
      !req.user ||
      !req.user.id
    ) {

      return res.status(401).json({

        message:
          "User authentication required"

      });
    }


    const userId =
      Number(req.user.id);


    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {

      return res.status(401).json({

        message:
          "Invalid user"

      });
    }


    // =================================================
    // GET BOOKING ID
    // =================================================

    const bookingId =
      Number(
        req.params.bookingId
      );


    // =================================================
    // VALIDATE BOOKING ID
    // =================================================

    if (
      !Number.isInteger(
        bookingId
      ) ||
      bookingId <= 0
    ) {

      return res.status(400).json({

        message:
          "Invalid booking ID"

      });
    }


    // =================================================
    // CANCEL BOOKING
    // =================================================

    const cancellation =
      await Booking.cancelBooking(
        bookingId,
        userId
      );


    // =================================================
    // LOG RESULT
    // =================================================

    console.log(
      "BOOKING CANCELLED:"
    );

    console.log(
      cancellation
    );


    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({

      message:
        "Booking cancelled successfully",

      booking:
        cancellation

    });


  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "CANCEL BOOKING ERROR:"
    );

    console.error(error);

    console.error(
      "================================="
    );


    // =================================================
    // BOOKING NOT FOUND
    // =================================================

    if (
      error.message ===
      "Booking not found"
    ) {

      return res.status(404).json({

        message:
          error.message

      });
    }


    // =================================================
    // NOT AUTHORIZED
    // =================================================

    if (
      error.message ===
      "You are not authorized to cancel this booking"
    ) {

      return res.status(403).json({

        message:
          error.message

      });
    }


    // =================================================
    // INVALID BOOKING STATUS
    // =================================================

    if (
      error.message &&
      error.message.includes(
        "Only confirmed bookings"
      )
    ) {

      return res.status(409).json({

        message:
          error.message

      });
    }


    // =================================================
    // OTHER ERROR
    // =================================================

    return res.status(500).json({

      message:
        error.message ||
        "Failed to cancel booking"

    });
  }
};