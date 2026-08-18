const db = require("../config/db");

const Booking = {

  async getAvailableSeats(scheduleId) {
    const [rows] = await db.execute(
      `
      SELECT
          ss.id,
          ss.schedule_id,
          ss.seat_id,
          s.seat_number,
          s.seat_type,
          ss.status
      FROM schedule_seats ss
      JOIN seats s
          ON ss.seat_id = s.id
      WHERE ss.schedule_id = ?
      ORDER BY s.id
      `,
      [scheduleId]
    );

    return rows;
  },

  async createBooking({
    userId,
    scheduleId,
    seatIds,
    totalAmount
  }) {

    const connection = await db.getConnection();

    try {

      // Start transaction
      await connection.beginTransaction();

      /*
       * Lock selected seats.
       * This prevents another transaction from booking
       * the same seats simultaneously.
       */
      const placeholders = seatIds.map(() => "?").join(",");

      const [seatRows] = await connection.execute(
        `
        SELECT
            id,
            schedule_id,
            seat_id,
            status
        FROM schedule_seats
        WHERE schedule_id = ?
        AND seat_id IN (${placeholders})
        FOR UPDATE
        `,
        [scheduleId, ...seatIds]
      );

      // Make sure all requested seats exist
      if (seatRows.length !== seatIds.length) {
        throw new Error("One or more seats are invalid");
      }

      // Check if any seat is already booked
      const alreadyBooked = seatRows.find(
        seat => seat.status === "BOOKED"
      );

      if (alreadyBooked) {
        throw new Error(
          `Seat ${alreadyBooked.seat_id} is already booked`
        );
      }

      // Generate booking reference
      const bookingReference =
        "BUS-" +
        Date.now() +
        "-" +
        Math.floor(Math.random() * 1000);

      // Create booking
      const [bookingResult] = await connection.execute(
        `
        INSERT INTO bookings
        (
          user_id,
          schedule_id,
          booking_reference,
          total_amount,
          status
        )
        VALUES (?, ?, ?, ?, 'CONFIRMED')
        `,
        [
          userId,
          scheduleId,
          bookingReference,
          totalAmount
        ]
      );

      const bookingId = bookingResult.insertId;

      // Insert booking seats
      for (const seat of seatRows) {

        await connection.execute(
          `
          INSERT INTO booking_seats
          (
            booking_id,
            seat_id,
            price
          )
          VALUES (?, ?, ?)
          `,
          [
            bookingId,
            seat.seat_id,
            totalAmount / seatIds.length
          ]
        );

        // Mark seat as booked
        await connection.execute(
          `
          UPDATE schedule_seats
          SET
              status = 'BOOKED',
              booking_id = ?
          WHERE schedule_id = ?
          AND seat_id = ?
          `,
          [
            bookingId,
            scheduleId,
            seat.seat_id
          ]
        );
      }

      // Commit everything
      await connection.commit();

      return {
        bookingId,
        bookingReference,
        scheduleId,
        seatIds,
        totalAmount,
        status: "CONFIRMED"
      };

    } catch (error) {

      // Undo all database changes
      await connection.rollback();

      throw error;

    } finally {

      // Return connection to pool
      connection.release();

    }
  }

};

module.exports = Booking;