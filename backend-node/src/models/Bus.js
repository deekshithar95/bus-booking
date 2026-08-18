const db = require("../config/db");

const Bus = {

  async create({ busNumber, busName, busType, totalSeats }) {
    const [result] = await db.execute(
      `INSERT INTO buses
       (bus_number, bus_name, bus_type, total_seats)
       VALUES (?, ?, ?, ?)`,
      [busNumber, busName, busType, totalSeats]
    );

    return this.findById(result.insertId);
  },

  async findAll() {
    const [rows] = await db.execute(
      `SELECT * FROM buses ORDER BY id DESC`
    );

    return rows;
  },

  async findById(id) {
    const [rows] = await db.execute(
      `SELECT * FROM buses WHERE id = ?`,
      [id]
    );

    return rows[0];
  },

  async update(id, { busNumber, busName, busType, totalSeats }) {
    await db.execute(
      `UPDATE buses
       SET bus_number = ?,
           bus_name = ?,
           bus_type = ?,
           total_seats = ?
       WHERE id = ?`,
      [busNumber, busName, busType, totalSeats, id]
    );

    return this.findById(id);
  },

  async delete(id) {
    const [result] = await db.execute(
      `DELETE FROM buses WHERE id = ?`,
      [id]
    );

    return result.affectedRows;
  }
};

module.exports = Bus;