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

      ORDER BY s.id
      `,
      [scheduleId]
    );

    return rows;
  },


  // =====================================================
  // CREATE BOOKING
  // POST /api/bookings
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
      // CREATE SQL PLACEHOLDERS
      // =================================================

      const placeholders = seatIds
        .map(() => "?")
        .join(",");


      // =================================================
      // LOCK SELECTED SEATS
      // =================================================

      const [seatRows] =
        await connection.execute(
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
          [
            scheduleId,
            ...seatIds
          ]
        );


      // =================================================
      // CHECK ALL SEATS EXIST
      // =================================================

      if (
        seatRows.length !==
        seatIds.length
      ) {

        throw new Error(
          "One or more seats are invalid"
        );
      }


      // =================================================
      // CHECK BOOKED SEATS
      // =================================================

      const alreadyBooked =
        seatRows.find(
          seat =>
            String(seat.status)
              .toUpperCase() ===
            "BOOKED"
        );


      if (alreadyBooked) {

        throw new Error(
          `Seat ${alreadyBooked.seat_id} is already booked`
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
            totalAmount /
            seatIds.length
          ).toFixed(2)
        );


      // =================================================
      // INSERT BOOKING SEATS
      // =================================================

      for (const seatId of seatIds) {

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


        if (updateResult.affectedRows !== 1) {

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

        seatIds,

        totalAmount,

        status: "CONFIRMED"

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

    // =================================================
    // GET BOOKING INFORMATION
    // =================================================

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


    // =================================================
    // GET SEATS FOR EACH BOOKING
    // =================================================

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


          ORDER BY st.id
          `,
          [booking.booking_id]
        );


      booking.seats = seatRows;
    }


    // =================================================
    // RETURN BOOKINGS
    // =================================================

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
            seat => seat.seat_id
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