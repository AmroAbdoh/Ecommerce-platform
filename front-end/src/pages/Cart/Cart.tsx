import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Button from "../../components/Button/Button";
import ModalCheckout from "../../components/ModalCheckout/ModalCheckout";
import {
  addToCart,
  clearCart,
  decreaseCartItem,
  getCart,
  removeCartItem,
  type Cart as CartData,
} from "../../services/cartApi";
import "./cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingProductId, setUpdatingProductId] = useState("");
  const [error, setError] = useState("");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");
      setCart(await getCart());
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load your cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateCart = async (
    productId: string,
    action: (productId: string) => Promise<CartData>,
  ) => {
    try {
      setUpdatingProductId(productId);
      setError("");
      setCart(await action(productId));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not update your cart");
    } finally {
      setUpdatingProductId("");
    }
  };

  const handleClearCart = async () => {
    try {
      setUpdatingProductId("clear");
      setError("");
      setCart(await clearCart());
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not clear your cart");
    } finally {
      setUpdatingProductId("");
    }
  };

  const handlePaymentSuccess = async () => {
    // Clear cart after successful payment
    try {
      setCart(await clearCart());
      // Show success message or redirect
      setError(""); // Clear any errors
    } catch (err: any) {
      console.error("Failed to clear cart after payment:", err);
    }
  };

  const items = cart?.items || [];
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <>
      <Navbar />
      <main className="cart-page">
        <div className="cart-header">
          <div>
            <h1>Your Cart</h1>
            <p>
              {itemCount} item{itemCount === 1 ? "" : "s"} ready for checkout
            </p>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              className="cart-clear-button"
              onClick={handleClearCart}
              disabled={updatingProductId === "clear"}
            >
              {updatingProductId === "clear" ? "Clearing..." : "Clear cart"}
            </button>
          )}
        </div>

        {loading && <p className="cart-status">Loading your cart...</p>}
        {error && <div className="cart-error">{error}</div>}

        {!loading && items.length === 0 && (
          <section className="cart-empty">
            <div className="cart-empty-icon" aria-hidden="true">
              +
            </div>
            <h2>Your cart is empty</h2>
            <p>Browse the store and add something you love.</p>
            <div className="cart-empty-action">
              <Button
                label="Continue shopping"
                type="button"
                onClick={() => navigate("/")}
              />
            </div>
          </section>
        )}

        {!loading && items.length > 0 && (
          <div className="cart-layout">
            <section className="cart-items" aria-label="Cart items">
              {items.map((item) => {
                const productId = item.product._id;
                const isUpdating = updatingProductId === productId;

                return (
                  <article className="cart-item" key={productId}>
                    <button
                      type="button"
                      className="cart-item-image"
                      onClick={() => navigate(`/product/${productId}`)}
                      aria-label={`View ${item.product.name}`}
                    >
                      {item.product.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                        />
                      ) : (
                        "No Image"
                      )}
                    </button>

                    <div className="cart-item-details">
                      <button
                        type="button"
                        className="cart-item-name"
                        onClick={() => navigate(`/product/${productId}`)}
                      >
                        {item.product.name}
                      </button>
                      <span className="cart-item-category">
                        {item.product.category}
                      </span>
                      <span className="cart-item-price">
                        ${item.product.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="cart-item-controls">
                      <div
                        className="quantity-control"
                        aria-label={`Quantity: ${item.quantity}`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            updateCart(productId, decreaseCartItem)
                          }
                          disabled={isUpdating}
                          aria-label={`Decrease ${item.product.name} quantity`}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCart(productId, (id) => addToCart(id))
                          }
                          disabled={
                            isUpdating || item.quantity >= item.product.stock
                          }
                          aria-label={`Increase ${item.product.name} quantity`}
                        >
                          +
                        </button>
                      </div>
                      <strong>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </strong>
                      <button
                        type="button"
                        className="cart-remove-button"
                        onClick={() => updateCart(productId, removeCartItem)}
                        disabled={isUpdating}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="cart-summary">
              <h2>Order summary</h2>
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div className="cart-summary-row cart-summary-muted">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="cart-summary-total">
                <span>Total</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <Button
                label="Checkout"
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
              />
              <button
                type="button"
                className="cart-continue-button"
                onClick={() => navigate("/")}
              >
                Continue shopping
              </button>
            </aside>
          </div>
        )}

        <ModalCheckout
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </main>
    </>
  );
}

export default Cart;
