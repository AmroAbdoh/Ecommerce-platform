const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const updateUserToSeller = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    user.role = "seller";
    await user.save();

    res.status(StatusCodes.OK).json({
      message: "User role updated to seller",
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateUserToSeller,
};