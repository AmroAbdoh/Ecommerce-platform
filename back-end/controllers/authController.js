const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res, next) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = (req.body.password || "").trim();

    if (!email || !password) {
      return next(new BadRequestError("Please provide email and password"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new UnauthenticatedError("Invalid Credentials"));
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return next(new UnauthenticatedError("Invalid Credentials"));
    }

    const token = user.createJWT();
    return res
      .status(StatusCodes.OK)
      .json({ user: { name: user.name }, token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
