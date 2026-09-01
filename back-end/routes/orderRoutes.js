const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticateUser");
const orderController = require("../controllers/orderController");

// Get all user orders
router.get("/", authenticateUser, orderController.getUserOrders);

// Get specific order by ID
router.get("/:orderId", authenticateUser, orderController.getOrderById);

module.exports = router;
