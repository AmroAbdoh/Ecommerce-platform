import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Button from "../../components/Button/Button";
import { getProductById, type Product } from "../../services/productApi";
import { addToCart } from "../../services/cartApi";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError("Product not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data.product);
        setError("");
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    try {
      setIsAdding(true);
      setCartMessage("");
      await addToCart(product._id);
      setCartMessage("Added to cart");
    } catch (err: any) {
      setCartMessage(
        err?.response?.data?.message || "Could not add product to cart",
      );
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="product-detail-page">
          <p>Loading product...</p>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="product-detail-page">
          <div className="product-detail-error">
            {error || "Product not found"}
          </div>
          <div className="product-detail-actions">
            <Button
              label="Back to Home"
              type="button"
              onClick={() => navigate("/")}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="product-detail-page">
        <div className="product-detail-card">
          <div className="product-detail-image">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} />
              ) : (
                "No Image"
              )}
          </div>

          <div className="product-detail-info">
            <span className="product-detail-category">{product.category}</span>
            <h1>{product.name}</h1>
            <p className="product-detail-price">${product.price}</p>
            <p className="product-detail-description">{product.description}</p>

            <div className="product-detail-meta">
              <span>In stock: {product.stock}</span>
              <span>Store: {product.store?.name || "Unknown store"}</span>
            </div>

            {cartMessage && (
              <div
                className={
                  cartMessage === "Added to cart"
                    ? "product-detail-success"
                    : "product-detail-cart-error"
                }
              >
                {cartMessage}
              </div>
            )}

            <div className="product-detail-actions">
              <Button
                label={isAdding ? "Adding..." : "Add to cart"}
                type="button"
                disabled={isAdding || product.stock < 1}
                onClick={handleAddToCart}
              />
              <Button
                label="Back to Home"
                type="button"
                variant="secondary"
                onClick={() => navigate("/")}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
