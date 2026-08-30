const Store = require("../models/Store");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const createStore = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const name = (req.body.name || "").trim();
    const description = (req.body.description || "").trim();

    if (!name || !description) {
      return next(
        new BadRequestError("Please provide store name and description"),
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(new UnauthenticatedError("User not found"));
    }

    if (user.role !== "seller") {
      return next(new UnauthenticatedError("Only sellers can create a store"));
    }

    const existingStore = await Store.findOne({ owner: userId });

    if (existingStore) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "You already have a store",
      });
    }

    const store = await Store.create({
      name,
      description,
      owner: userId,
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStore,
};
