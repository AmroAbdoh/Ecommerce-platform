const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticateUser");
const paymentController = require("../controllers/paymentController");

// Create payment intent
router.post(
  "/create-intent",
  authenticateUser,
  paymentController.createPaymentIntent,
);

// Process payment
router.post("/process", authenticateUser, paymentController.processPayment);

module.exports = router;
