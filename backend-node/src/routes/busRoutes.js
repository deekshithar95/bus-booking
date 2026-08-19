const express = require("express");

const router = express.Router();


// =====================================================
// GET ALL BUSES
// GET /api/buses
// =====================================================

router.get("/", async (req, res) => {
  try {
    const db = req.app.locals.db;

    const [rows] = await db.query(`
      SELECT
        b.id,
        b.bus_number,
        b.bus_name,
        b.bus_type,
        b.total_seats,
        b.created_at
      FROM buses b
      ORDER BY b.id DESC
    `);

    res.json(rows);

  } catch (error) {
    console.error("Get buses error:", error);

    res.status(500).json({
      message: "Failed to get buses",
      error: error.message
    });
  }
});


// =====================================================
// SEARCH BUSES
// GET /api/buses/search?from=&to=&date=
// =====================================================

router.get("/search", async (req, res) => {

  try {

    const { from, to, date } = req.query;

    console.log("=================================");
    console.log("BUS SEARCH");
    console.log("From:", from);
    console.log("To:", to);
    console.log("Date:", date);
    console.log("=================================");


    // -----------------------------------------------
    // Validate
    // -----------------------------------------------

    if (!from || !to || !date) {

      return res.status(400).json({
        message: "From, To and Date are required"
      });

    }


    const db = req.app.locals.db;


    // -----------------------------------------------
    // Search schedules
    // -----------------------------------------------

    const [rows] = await db.query(
      `
      SELECT

        s.id AS schedule_id,

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

      FROM schedules s

      INNER JOIN buses b
        ON s.bus_id = b.id

      INNER JOIN routes r
        ON s.route_id = r.id

      WHERE LOWER(TRIM(r.source)) =
            LOWER(TRIM(?))

      AND LOWER(TRIM(r.destination)) =
          LOWER(TRIM(?))

      AND s.travel_date = ?

      ORDER BY s.departure_time ASC
      `,
      [
        from,
        to,
        date
      ]
    );


    console.log("Buses found:", rows);


    // -----------------------------------------------
    // Return response
    // -----------------------------------------------

    res.json({
      buses: rows
    });


  } catch (error) {

    console.error(
      "Bus search error:",
      error
    );

    res.status(500).json({
      message: "Failed to search buses",
      error: error.message
    });

  }

});


module.exports = router;