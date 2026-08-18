const Route = require("../models/Route");

exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.findAll();

    res.json(routes);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch routes"
    });
  }
};

exports.getRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        message: "Route not found"
      });
    }

    res.json(route);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch route"
    });
  }
};

exports.createRoute = async (req, res) => {
  try {
    const {
      source,
      destination,
      distanceKm,
      durationMinutes
    } = req.body;

    if (!source || !destination) {
      return res.status(400).json({
        message: "Source and destination are required"
      });
    }

    const route = await Route.create({
      source,
      destination,
      distanceKm,
      durationMinutes
    });

    res.status(201).json({
      message: "Route created successfully",
      route
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create route"
    });
  }
};