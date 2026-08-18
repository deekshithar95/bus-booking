const express = require("express");

const {
  getRoutes,
  getRoute,
  createRoute
} = require("../controllers/routeController");

const {
  protect,
  adminOnly
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getRoutes);

router.get("/:id", getRoute);

router.post(
  "/",
  protect,
  adminOnly,
  createRoute
);

module.exports = router;