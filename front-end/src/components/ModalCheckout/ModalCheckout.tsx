import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { type Cart as CartData } from "../../services/cartApi";
import { processPayment } from "../../services/paymentApi";
import "./modalCheckout.css";

interface ModalCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartData | null;
  onPaymentSuccess: () => void;
}

function ModalCheckout({
  isOpen,
  onClose,
  cart,
  onPaymentSuccess,
}: ModalCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const total = subtotal; // You can add shipping, taxes here

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe is not loaded");
      return;
    }

    if (!email || !name) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        setError("Card element not found");
        return;
      }

      // Create payment method
      const { error: paymentError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name,
            email,
          },
        });

      if (paymentError) {
        setError(paymentError.message || "Payment error occurred");
        return;
      }

      // Process payment
      const response = await processPayment({
        amount: Math.round(total * 100), // Convert to cents
        currency: "usd",
        paymentMethodId: paymentMethod.id,
        cartItems: items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      });

      if (response.success) {
        // Clear form and close modal
        setEmail("");
        setName("");
        cardElement.clear();
        onPaymentSuccess();
        onClose();
      } else {
        setError(response.message || "Payment failed");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred during payment");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-checkout" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Checkout</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close checkout"
          >
            ✕
          </button>
        </div>

        <div className="modal-content">
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="checkout-items">
              {items.map((item) => (
                <div key={item.product._id} className="checkout-item">
                  <span>
                    {item.product.name} x{item.quantity}
                  </span>
                  <span>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="checkout-total">
              <strong>Total:</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="checkout-form">
            {error && <div className="checkout-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>Card Details</label>
              <div className="card-element-wrapper">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#333",
                        "::placeholder": {
                          color: "#999",
                        },
                      },
                      invalid: {
                        color: "#dc2626",
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="checkout-actions">
              <button
                type="submit"
                className="checkout-pay-button"
                disabled={loading || !stripe}
              >
                {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </button>
              <button
                type="button"
                className="checkout-cancel-button"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ModalCheckout;
