const Product = require("../models/Product");
const Store = require("../models/Store");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");

const createProduct = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { name, description, price, images, stock, category } = req.body;

    // Validate required fields
    if (!name || !description || price === undefined || !category) {
      return next(
        new BadRequestError(
          "Please provide name, description, price, and category",
        ),
      );
    }

    // Check if user is a seller
    const user = await User.findById(userId);
    if (!user || user.role !== "seller") {
      return next(new UnauthenticatedError("Only sellers can create products"));
    }

    // Get seller's store
    const store = await Store.findOne({ owner: userId });
    if (!store) {
      return next(new BadRequestError("You don't have a store yet"));
    }

    // Create product
    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      images: images || [],
      stock: stock || 0,
      category,
      store: store._id,
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const { category, store } = req.query;

    // Build filter object
    const filter = { stock: { $gt: 0 } }; // Only show products with stock > 0
    if (category) {
      filter.category = category;
    }
    if (store) {
      filter.store = store;
    }

    const products = await Product.find(filter)
      .populate("store", "name logo owner")
      .sort({ createdAt: -1 });

    return res.status(StatusCodes.OK).json({
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

const getSellerProducts = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const store = await Store.findOne({ owner: userId });
    if (!store) {
      return next(new BadRequestError("You don't have a store yet"));
    }

    const products = await Product.find({ store: store._id })
      .populate("store", "name logo owner")
      .sort({ createdAt: -1 });

    return res.status(StatusCodes.OK).json({
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

const getOneProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new BadRequestError("Please provide product ID"));
    }

    const product = await Product.findById(id).populate(
      "store",
      "name logo description owner",
    );

    if (!product) {
      return next(new NotFoundError("Product not found"));
    }

    return res.status(StatusCodes.OK).json({
      product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { name, description, price, images, stock, category } = req.body;

    if (!id) {
      return next(new BadRequestError("Please provide product ID"));
    }

    // Find product
    const product = await Product.findById(id);
    if (!product) {
      return next(new NotFoundError("Product not found"));
    }

    // Check ownership
    const store = await Store.findById(product.store);
    if (store.owner.toString() !== userId) {
      return next(
        new UnauthenticatedError(
          "You don't have permission to update this product",
        ),
      );
    }

    // Update fields
    if (name) product.name = name.trim();
    if (description) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (images) product.images = images;
    if (stock !== undefined) product.stock = Number(stock);
    if (category) product.category = category;

    await product.save();

    return res.status(StatusCodes.OK).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    if (!id) {
      return next(new BadRequestError("Please provide product ID"));
    }

    // Find product
    const product = await Product.findById(id);
    if (!product) {
      return next(new NotFoundError("Product not found"));
    }

    // Check ownership
    const store = await Store.findById(product.store);
    if (store.owner.toString() !== userId) {
      return next(
        new UnauthenticatedError(
          "You don't have permission to delete this product",
        ),
      );
    }

    await Product.findByIdAndDelete(id);

    return res.status(StatusCodes.OK).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSellerProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
