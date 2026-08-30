const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authenticateUser");
const {
  createProduct,
  getAllProducts,
  getSellerProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Public routes
router.get("/", getAllProducts);

// Seller-specific routes
router.get("/my-products", authenticateUser, getSellerProducts);
router.get("/:id", getOneProduct);

// Protected routes (seller only)
router.post("/", authenticateUser, createProduct);
router.patch("/:id", authenticateUser, updateProduct);
router.delete("/:id", authenticateUser, deleteProduct);

module.exports = router;
