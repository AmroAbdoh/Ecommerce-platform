const Order = require("../models/Order");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ owner: userId })
      .populate({
        path: "cart",
        populate: {
          path: "items.product",
          select: "name price images",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(StatusCodes.OK).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate({
      path: "cart",
      populate: {
        path: "items.product",
        select: "name price images category store",
        populate: {
          path: "store",
          select: "name",
        },
      },
    });

    if (!order) {
      return next(new NotFoundError("Order not found"));
    }

    // Verify order belongs to user
    if (order.owner.toString() !== userId) {
      return next(new NotFoundError("Order not found"));
    }

    return res.status(StatusCodes.OK).json({
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserOrders,
  getOrderById,
};
