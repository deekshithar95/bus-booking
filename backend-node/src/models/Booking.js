const db = require("../config/db");

const Booking = {

  // =====================================================
  // GET AVAILABLE SEATS
  // GET /api/bookings/schedule/:scheduleId/seats
  // =====================================================

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

      INNER JOIN seats s
        ON ss.seat_id = s.id

      WHERE ss.schedule_id = ?

      ORDER BY CAST(s.seat_number AS UNSIGNED)
      `,
      [scheduleId]
    );

    return rows;
  },


  // =====================================================
  // CREATE BOOKING
  // POST /api/bookings
  //
  // IMPORTANT:
  // seatIds received from controller are actually
  // SEAT NUMBERS from frontend.
  //
  // Example:
  // frontend sends:
  // seats: [24]
  //
  // database:
  // seat_number = 24
  // seat_id     = 97
  //
  // This method converts:
  // seat number 24 -> seat_id 97
  // =====================================================

  async createBooking({
    userId,
    scheduleId,
    seatIds,
    totalAmount
  }) {

    const connection = await db.getConnection();

    try {

      // =================================================
      // START TRANSACTION
      // =================================================

      await connection.beginTransaction();


      // =================================================
      // VALIDATE INPUT
      // =================================================

      if (
        !Array.isArray(seatIds) ||
        seatIds.length === 0
      ) {

        throw new Error(
          "At least one seat is required"
        );
      }


      // =================================================
      // NORMALIZE SEAT NUMBERS
      //
      // The controller sends seat numbers.
      //
      // Example:
      // [24, 25]
      // =================================================

      const seatNumbers =
        seatIds.map(Number);


      // =================================================
      // VALIDATE SEAT NUMBERS
      // =================================================

      if (
        seatNumbers.some(
          seat =>
            !Number.isInteger(seat) ||
            seat <= 0
        )
      ) {

        throw new Error(
          "Invalid seat number"
        );
      }


      // =================================================
      // CHECK DUPLICATE SEAT NUMBERS
      // =================================================

      const uniqueSeatNumbers =
        [...new Set(seatNumbers)];


      if (
        uniqueSeatNumbers.length !==
        seatNumbers.length
      ) {

        throw new Error(
          "Duplicate seats are not allowed"
        );
      }


      // =================================================
      // CREATE PLACEHOLDERS
      // =================================================

      const placeholders =
        uniqueSeatNumbers
          .map(() => "?")
          .join(",");


      // =================================================
      // FIND SCHEDULE + BUS
      //
      // This is important because seat numbers belong
      // to a particular bus.
      // =================================================

      const [scheduleRows] =
        await connection.execute(
          `
          SELECT
            sc.id AS schedule_id,
            sc.bus_id,
            b.total_seats

          FROM schedules sc

          INNER JOIN buses b
            ON sc.bus_id = b.id

          WHERE sc.id = ?

          FOR UPDATE
          `,
          [scheduleId]
        );


      // =================================================
      // CHECK SCHEDULE EXISTS
      // =================================================

      if (
        scheduleRows.length === 0
      ) {

        throw new Error(
          "Schedule not found"
        );
      }


      const schedule =
        scheduleRows[0];


      // =================================================
      // VALIDATE SEAT NUMBERS AGAINST BUS CAPACITY
      // =================================================

      const invalidSeatNumber =
        uniqueSeatNumbers.find(
          seat =>
            seat > Number(schedule.total_seats)
        );


      if (invalidSeatNumber) {

        throw new Error(
          `Seat ${invalidSeatNumber} is invalid for this bus`
        );
      }


      // =================================================
      // FIND ACTUAL SEAT IDS
      //
      // Example:
      //
      // seat number 24
      //
      // becomes:
      //
      // seat_id 97
      // =================================================

      const [seatRows] =
        await connection.execute(
          `
          SELECT
            s.id AS seat_id,
            s.bus_id,
            s.seat_number,
            s.seat_type

          FROM seats s

          WHERE s.bus_id = ?

          AND s.seat_number IN (${placeholders})

          FOR UPDATE
          `,
          [
            schedule.bus_id,
            ...uniqueSeatNumbers.map(String)
          ]
        );


      // =================================================
      // CHECK ALL SEATS EXIST
      // =================================================

      if (
        seatRows.length !==
        uniqueSeatNumbers.length
      ) {

        const foundSeatNumbers =
          seatRows.map(
            seat =>
              String(seat.seat_number)
          );

        const missingSeat =
          uniqueSeatNumbers.find(
            seat =>
              !foundSeatNumbers.includes(
                String(seat)
              )
          );

        throw new Error(
          `Seat ${missingSeat} is invalid`
        );
      }


      // =================================================
      // CONVERT SEAT NUMBERS -> SEAT IDS
      //
      // Example:
      //
      // 24 -> 97
      // 25 -> 96
      // =================================================

      const actualSeatIds =
        seatRows.map(
          seat =>
            Number(seat.seat_id)
        );


      // =================================================
      // LOCK SCHEDULE SEATS
      //
      // Now we use the REAL seat_id values.
      // =================================================

      const scheduleSeatPlaceholders =
        actualSeatIds
          .map(() => "?")
          .join(",");


      const [scheduleSeatRows] =
        await connection.execute(
          `
          SELECT

            ss.id,
            ss.schedule_id,
            ss.seat_id,
            ss.status,
            ss.booking_id,

            s.seat_number,
            s.seat_type

          FROM schedule_seats ss

          INNER JOIN seats s
            ON ss.seat_id = s.id

          WHERE ss.schedule_id = ?

          AND ss.seat_id IN (${scheduleSeatPlaceholders})

          FOR UPDATE
          `,
          [
            scheduleId,
            ...actualSeatIds
          ]
        );


      // =================================================
      // CHECK ALL SEATS EXIST FOR THIS SCHEDULE
      // =================================================

      if (
        scheduleSeatRows.length !==
        actualSeatIds.length
      ) {

        throw new Error(
          "One or more seats are not available for this schedule"
        );
      }


      // =================================================
      // CHECK BOOKED SEATS
      // =================================================

      const alreadyBooked =
        scheduleSeatRows.find(
          seat =>
            String(seat.status)
              .toUpperCase() ===
            "BOOKED"
        );


      if (alreadyBooked) {

        throw new Error(
          `Seat ${alreadyBooked.seat_number} is already booked`
        );
      }


      // =================================================
      // CHECK AVAILABLE STATUS
      // =================================================

      const unavailableSeat =
        scheduleSeatRows.find(
          seat =>
            String(seat.status)
              .toUpperCase() !==
            "AVAILABLE"
        );


      if (unavailableSeat) {

        throw new Error(
          `Seat ${unavailableSeat.seat_number} is not available`
        );
      }


      // =================================================
      // GENERATE BOOKING REFERENCE
      // =================================================

      const bookingReference =
        "BUS-" +
        Date.now() +
        "-" +
        Math.floor(
          Math.random() * 1000
        );


      // =================================================
      // CREATE BOOKING
      // =================================================

      const [bookingResult] =
        await connection.execute(
          `
          INSERT INTO bookings
          (
            user_id,
            schedule_id,
            booking_reference,
            total_amount,
            status
          )

          VALUES
          (?, ?, ?, ?, 'CONFIRMED')
          `,
          [
            userId,
            scheduleId,
            bookingReference,
            totalAmount
          ]
        );


      const bookingId =
        bookingResult.insertId;


      // =================================================
      // CALCULATE PRICE PER SEAT
      // =================================================

      const pricePerSeat =
        Number(
          (
            Number(totalAmount) /
            actualSeatIds.length
          ).toFixed(2)
        );


      // =================================================
      // INSERT BOOKING SEATS
      //
      // IMPORTANT:
      // Store REAL seat_id, NOT seat number.
      // =================================================

      for (const seatId of actualSeatIds) {

        await connection.execute(
          `
          INSERT INTO booking_seats
          (
            booking_id,
            seat_id,
            price
          )

          VALUES
          (?, ?, ?)
          `,
          [
            bookingId,
            seatId,
            pricePerSeat
          ]
        );


        // =================================================
        // MARK SEAT AS BOOKED
        // =================================================

        const [updateResult] =
          await connection.execute(
            `
            UPDATE schedule_seats

            SET
              status = 'BOOKED',
              booking_id = ?

            WHERE schedule_id = ?

            AND seat_id = ?

            AND status = 'AVAILABLE'
            `,
            [
              bookingId,
              scheduleId,
              seatId
            ]
          );


        // =================================================
        // VERIFY UPDATE
        // =================================================

        if (
          updateResult.affectedRows !== 1
        ) {

          throw new Error(
            `Failed to book seat ${seatId}`
          );
        }
      }


      // =================================================
      // COMMIT TRANSACTION
      // =================================================

      await connection.commit();


      // =================================================
      // RETURN BOOKING
      // =================================================

      return {

        bookingId,

        bookingReference,

        scheduleId,

        // Return seat numbers to frontend
        seatIds:
          uniqueSeatNumbers,

        // Also return actual database seat IDs
        databaseSeatIds:
          actualSeatIds,

        totalAmount,

        status:
          "CONFIRMED"

      };


    } catch (error) {

      // =================================================
      // ROLLBACK
      // =================================================

      await connection.rollback();

      throw error;


    } finally {

      // =================================================
      // RELEASE CONNECTION
      // =================================================

      connection.release();
    }
  },


  // =====================================================
  // GET BOOKINGS BY USER
  // BOOKING HISTORY
  // GET /api/bookings/my-bookings
  // =====================================================

  async getBookingsByUser(userId) {

    const [rows] =
      await db.execute(
        `
        SELECT

          bk.id AS booking_id,

          bk.user_id,

          bk.schedule_id,

          bk.booking_reference,

          bk.total_amount,

          bk.status,

          bk.created_at,

          s.travel_date,

          s.departure_time,

          s.arrival_time,

          s.fare,

          b.id AS bus_id,

          b.bus_number,

          b.bus_name,

          b.bus_type,

          b.total_seats,

          r.id AS route_id,

          r.source,

          r.destination,

          r.distance_km,

          r.duration_minutes

        FROM bookings bk

        INNER JOIN schedules s
          ON bk.schedule_id = s.id

        INNER JOIN buses b
          ON s.bus_id = b.id

        INNER JOIN routes r
          ON s.route_id = r.id

        WHERE bk.user_id = ?

        ORDER BY bk.created_at DESC
        `,
        [userId]
      );


    // =====================================================
    // GET SEATS FOR EACH BOOKING
    // =====================================================

    for (const booking of rows) {

      const [seatRows] =
        await db.execute(
          `
          SELECT

            bs.seat_id,

            bs.price,

            st.seat_number,

            st.seat_type

          FROM booking_seats bs

          INNER JOIN seats st
            ON bs.seat_id = st.id

          WHERE bs.booking_id = ?

          ORDER BY CAST(st.seat_number AS UNSIGNED)
          `,
          [booking.booking_id]
        );


      booking.seats =
        seatRows;
    }


    // =====================================================
    // RETURN BOOKINGS
    // =====================================================

    return rows;
  },


  // =====================================================
  // CANCEL BOOKING
  // DELETE /api/bookings/:bookingId
  // =====================================================

  async cancelBooking(
    bookingId,
    userId
  ) {

    const connection =
      await db.getConnection();


    try {

      // =================================================
      // START TRANSACTION
      // =================================================

      await connection.beginTransaction();


      // =================================================
      // GET BOOKING AND LOCK IT
      // =================================================

      const [bookingRows] =
        await connection.execute(
          `
          SELECT

            id,

            user_id,

            schedule_id,

            booking_reference,

            total_amount,

            status,

            created_at

          FROM bookings

          WHERE id = ?

          FOR UPDATE
          `,
          [
            bookingId
          ]
        );


      // =================================================
      // CHECK BOOKING EXISTS
      // =================================================

      if (
        bookingRows.length === 0
      ) {

        throw new Error(
          "Booking not found"
        );
      }


      const booking =
        bookingRows[0];


      // =================================================
      // CHECK BOOKING OWNER
      // =================================================

      if (
        Number(booking.user_id) !==
        Number(userId)
      ) {

        throw new Error(
          "You are not authorized to cancel this booking"
        );
      }


      // =================================================
      // CHECK BOOKING STATUS
      // =================================================

      if (
        String(booking.status)
          .toUpperCase() !==
        "CONFIRMED"
      ) {

        throw new Error(
          "Only confirmed bookings can be cancelled"
        );
      }


      // =================================================
      // GET AND LOCK BOOKED SEATS
      // =================================================

      const [seatRows] =
        await connection.execute(
          `
          SELECT

            id,

            schedule_id,

            seat_id,

            status,

            booking_id

          FROM schedule_seats

          WHERE booking_id = ?

          AND schedule_id = ?

          FOR UPDATE
          `,
          [
            bookingId,
            booking.schedule_id
          ]
        );


      // =================================================
      // RELEASE SEATS
      // =================================================

      await connection.execute(
        `
        UPDATE schedule_seats

        SET

          status = 'AVAILABLE',

          booking_id = NULL

        WHERE booking_id = ?

        AND schedule_id = ?
        `,
        [
          bookingId,
          booking.schedule_id
        ]
      );


      // =================================================
      // UPDATE BOOKING STATUS
      // =================================================

      const [cancelResult] =
        await connection.execute(
          `
          UPDATE bookings

          SET

            status = 'CANCELLED'

          WHERE id = ?

          AND user_id = ?

          AND status = 'CONFIRMED'
          `,
          [
            bookingId,
            userId
          ]
        );


      // =================================================
      // VERIFY BOOKING WAS CANCELLED
      // =================================================

      if (
        cancelResult.affectedRows !== 1
      ) {

        throw new Error(
          "Failed to cancel booking"
        );
      }


      // =================================================
      // COMMIT
      // =================================================

      await connection.commit();


      // =================================================
      // RETURN CANCELLATION
      // =================================================

      return {

        bookingId:
          booking.id,

        bookingReference:
          booking.booking_reference,

        scheduleId:
          booking.schedule_id,

        totalAmount:
          booking.total_amount,

        previousStatus:
          booking.status,

        status:
          "CANCELLED",

        releasedSeats:
          seatRows.map(
            seat =>
              seat.seat_id
          )

      };


    } catch (error) {

      // =================================================
      // ROLLBACK
      // =================================================

      await connection.rollback();

      throw error;


    } finally {

      // =================================================
      // RELEASE CONNECTION
      // =================================================

      connection.release();
    }
  }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = Booking;