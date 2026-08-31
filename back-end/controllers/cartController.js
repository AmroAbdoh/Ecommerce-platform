const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ owner: userId }).populate(
      "items.product",
      "name price images stock category",
    );

    if (!cart) {
      return res.status(StatusCodes.OK).json({
        message: "Cart is empty",
        cart: { owner: userId, items: [] },
      });
    }

    return res.status(StatusCodes.OK).json({ cart });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return next(new BadRequestError("Please provide a product id"));
    }

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return next(new BadRequestError("Quantity must be a positive integer"));
    }

    const product = await Product.findById(productId);

    if (!product) {
      return next(new NotFoundError("Product not found"));
    }

    if (product.stock < 1) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "This product is currently out of stock",
      });
    }

    let cart = await Cart.findOne({ owner: userId });

    if (!cart) {
      cart = await Cart.create({ owner: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      const nextQuantity = existingItem.quantity + parsedQuantity;

      if (nextQuantity > product.stock) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `Only ${product.stock} item(s) left in stock`,
        });
      }

      existingItem.quantity = nextQuantity;
    } else {
      if (parsedQuantity > product.stock) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: `Only ${product.stock} item(s) left in stock`,
        });
      }

      cart.items.push({ product: productId, quantity: parsedQuantity });
    }

    await cart.save();

    const populatedCart = await cart.populate(
      "items.product",
      "name price images stock category",
    );

    return res.status(StatusCodes.OK).json({
      message: "Product added to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

const decreaseFromCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ owner: userId });

    if (!cart) {
      return next(new NotFoundError("Cart not found"));
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return next(new NotFoundError("Product not found in cart"));
    }

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    const populatedCart = await cart.populate(
      "items.product",
      "name price images stock category",
    );

    return res.status(StatusCodes.OK).json({
      message: "Cart updated successfully",
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ owner: userId });

    if (!cart) {
      return next(new NotFoundError("Cart not found"));
    }

    const itemExists = cart.items.some(
      (item) => item.product.toString() === productId,
    );

    if (!itemExists) {
      return next(new NotFoundError("Product not found in cart"));
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    const populatedCart = await cart.populate(
      "items.product",
      "name price images stock category",
    );

    return res.status(StatusCodes.OK).json({
      message: "Product removed from cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ owner: userId });

    if (!cart) {
      return res.status(StatusCodes.OK).json({
        message: "Cart already empty",
        cart: { owner: userId, items: [] },
      });
    }

    cart.items = [];
    await cart.save();

    return res.status(StatusCodes.OK).json({
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  decreaseFromCart,
  removeFromCart,
  clearCart,
};
