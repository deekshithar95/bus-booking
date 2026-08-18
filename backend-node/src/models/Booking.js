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
  }

};

module.exports = Booking;