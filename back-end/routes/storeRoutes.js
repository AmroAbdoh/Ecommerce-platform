const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authenticateUser");
const { createStore } = require("../controllers/storeController");

router.post("/", authenticateUser, createStore);

module.exports = router;
