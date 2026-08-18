const db = require("../config/db");

const Route = {

  async create({
    source,
    destination,
    distanceKm,
    durationMinutes
  }) {
    const [result] = await db.execute(
      `INSERT INTO routes
       (source, destination, distance_km, duration_minutes)
       VALUES (?, ?, ?, ?)`,
      [
        source,
        destination,
        distanceKm,
        durationMinutes
      ]
    );

    return this.findById(result.insertId);
  },

  async findAll() {
    const [rows] = await db.execute(
      `SELECT * FROM routes ORDER BY id DESC`
    );

    return rows;
  },

  async findById(id) {
    const [rows] = await db.execute(
      `SELECT * FROM routes WHERE id = ?`,
      [id]
    );

    return rows[0];
  }
};

module.exports = Route;