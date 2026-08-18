const Bus = require("../models/Bus");

exports.getBuses = async (req, res) => {
  try {
    const buses = await Bus.findAll();

    res.json(buses);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch buses"
    });
  }
};

exports.getBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found"
      });
    }

    res.json(bus);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch bus"
    });
  }
};

exports.createBus = async (req, res) => {
  try {
    const {
      busNumber,
      busName,
      busType,
      totalSeats
    } = req.body;

    if (!busNumber || !busName || !busType || !totalSeats) {
      return res.status(400).json({
        message: "All bus fields are required"
      });
    }

    const bus = await Bus.create({
      busNumber,
      busName,
      busType,
      totalSeats
    });

    res.status(201).json({
      message: "Bus created successfully",
      bus
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create bus"
    });
  }
};

exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found"
      });
    }

    const updatedBus = await Bus.update(
      req.params.id,
      req.body
    );

    res.json({
      message: "Bus updated successfully",
      bus: updatedBus
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update bus"
    });
  }
};

exports.deleteBus = async (req, res) => {
  try {
    const affectedRows = await Bus.delete(req.params.id);

    if (affectedRows === 0) {
      return res.status(404).json({
        message: "Bus not found"
      });
    }

    res.json({
      message: "Bus deleted successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete bus"
    });
  }
};