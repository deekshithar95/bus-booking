const db = require("../config/db");

const User = {
  async create({ name, email, password, phone, role = "CUSTOMER" }) {
    const [result] = await db.execute(
      `INSERT INTO users
       (name, email, password, phone, role)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, password, phone, role]
    );

    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await db.execute(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.execute(
      `SELECT id, name, email, phone, role, created_at
       FROM users
       WHERE id = ?`,
      [id]
    );

    return rows[0];
  }
};

module.exports = User;