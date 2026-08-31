const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticateUser");
const {
  getCart,
  addToCart,
  decreaseFromCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

router.use(authenticateUser);

router.get("/", getCart);
router.post("/add", addToCart);
router.patch("/decrease/:productId", decreaseFromCart);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

module.exports = router;
