const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticateUser");

const { updateUserToSeller } = require("../controllers/userController");

router.patch("/become-seller", authenticateUser, updateUserToSeller);

module.exports = router;
