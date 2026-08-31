import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Button from "../../components/Button/Button";
import { getAllProducts, type Product } from "../../services/productApi";
import { addToCart } from "../../services/cartApi";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addingProductId, setAddingProductId] = useState("");
  const [addedProductId, setAddedProductId] = useState("");
  const [cartError, setCartError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data.products || []);
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddToCart = async (productId: string) => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    try {
      setAddingProductId(productId);
      setAddedProductId("");
      setCartError("");
      await addToCart(productId);
      setAddedProductId(productId);
    } catch (err: any) {
      setCartError(err?.response?.data?.message || "Could not add product to cart");
    } finally {
      setAddingProductId("");
    }
  };

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />

      <div className="home-page">
        <div className="home-header">
          <h1>Our Products</h1>
          <p>Discover the latest items in our store</p>
        </div>

        <div className="filter-bar">
          <div className="search-wrap">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="category-wrap">
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <p className="home-status">Loading products...</p>}

        {error && <div className="home-error">{error}</div>}
        {cartError && <div className="home-error">{cartError}</div>}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="home-empty">
            No products match your search or category.
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} />
                        ) : (
                          "No Image"
                        )}
                </div>

                <div className="product-row">
                  <h3>{product.name}</h3>
                  <span className="product-price">${product.price}</span>
                </div>

                <p className="product-description">{product.description}</p>

                <div className="product-meta">
                  <span>Category: {product.category}</span>
                  <span>Stock: {product.stock}</span>
                </div>

                <div className="product-actions">
                  <div className="product-button-wrap">
                    <Button
                      label="View Product"
                      type="button"
                      onClick={() => navigate(`/product/${product._id}`)}
                    />
                  </div>

                  <div className="product-button-wrap">
                    <Button
                      label={
                        addingProductId === product._id
                          ? "Adding..."
                          : addedProductId === product._id
                            ? "Added to cart"
                            : "Add to cart"
                      }
                      type="button"
                      variant="secondary"
                      disabled={
                        product.stock < 1 || addingProductId === product._id
                      }
                      onClick={() => handleAddToCart(product._id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
