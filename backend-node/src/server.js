const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const mysql = require("mysql2/promise");

const PORT = process.env.PORT || 5000;


// ==========================================
// CREATE MYSQL CONNECTION POOL
// ==========================================

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",

  user: process.env.DB_USER || "root",

  password: process.env.DB_PASSWORD || "",

  database: process.env.DB_NAME || "bus_booking",

  port: Number(process.env.DB_PORT) || 3306,

  waitForConnections: true,

  connectionLimit: 10,

  queueLimit: 0
});


// ==========================================
// TEST DATABASE CONNECTION
// ==========================================

async function startServer() {

  try {

    const connection = await db.getConnection();

    console.log("MySQL connected successfully");

    connection.release();


    // Make database available to routes

    app.locals.db = db;


    // Start Express server

    app.listen(PORT, () => {

      console.log(
        `Server running on http://localhost:${PORT}`
      );

    });

  } catch (error) {

    console.error(
      "MySQL connection failed:",
      error.message
    );

    process.exit(1);

  }

}


startServer();