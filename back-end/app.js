const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const storeRoutes = require("./routes/storeRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "E-Commerce API is running",
  });
});

// Authentication
app.use("/api/auth", authRoutes);

// User
app.use("/api/users", userRoutes);

// Store
app.use("/api/stores", storeRoutes);

// Product
app.use("/api/products", productRoutes);

// Cart
app.use("/api/cart", cartRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Server Error";

  res.status(statusCode).json({ message });
});

module.exports = app;
