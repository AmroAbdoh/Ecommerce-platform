const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getStripe = () => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  return stripe;
};

const createPaymentIntent = async (req, res, next) => {
  try {
    const stripe = getStripe();
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return next(new BadRequestError("Invalid amount"));
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    return res.status(StatusCodes.OK).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

const processPayment = async (req, res, next) => {
  try {
    const stripe = getStripe();
    const userId = req.user.userId;
    const { amount, paymentMethodId } = req.body;

    if (!amount || !paymentMethodId) {
      return next(new BadRequestError("Missing required payment information"));
    }

    // Verify cart exists and belongs to user
    const cart = await Cart.findOne({ owner: userId }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return next(new BadRequestError("Cart is empty"));
    }

    // Verify product stock and calculate total
    let calculatedTotal = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        return next(
          new NotFoundError(`Product not found: ${item.product._id}`),
        );
      }

      if (product.stock < item.quantity) {
        return next(
          new BadRequestError(
            `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          ),
        );
      }

      calculatedTotal += product.price * item.quantity;
    }

    // Verify amount matches
    if (Math.round(calculatedTotal * 100) !== amount) {
      return next(new BadRequestError("Amount mismatch"));
    }

    // Create payment with Stripe
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    if (payment.status !== "succeeded") {
      return next(new BadRequestError("Payment failed: " + payment.status));
    }

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } },
        { new: true },
      );
    }

    // Create order with cart reference
    const order = await Order.create({
      owner: userId,
      cart: cart._id,
      total: calculatedTotal,
      paymentId: payment.id,
      status: "completed",
    });

    // Clear cart
    await Cart.findByIdAndUpdate(cart._id, { items: [] });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      orderId: order._id,
      message: "Payment successful and order created",
    });
  } catch (error) {
    // Handle Stripe errors
    if (error.type === "StripeCardError") {
      return next(new BadRequestError(error.message));
    }
    next(error);
  }
};

module.exports = {
  createPaymentIntent,
  processPayment,
};
