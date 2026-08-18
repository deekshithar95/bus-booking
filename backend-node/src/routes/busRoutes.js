const express = require("express");

const {
  getBuses,
  getBus,
  createBus,
  updateBus,
  deleteBus
} = require("../controllers/busController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getBuses);

router.get("/:id", getBus);

router.post("/", protect, adminOnly, createBus);

router.put("/:id", protect, adminOnly, updateBus);

router.delete("/:id", protect, adminOnly, deleteBus);

module.exports = router;