import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts, type Product } from "../../services/productApi";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token")),
  );
  const [isSeller, setIsSeller] = useState(
    localStorage.getItem("userRole") === "seller",
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const syncAuthState = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
      setIsSeller(localStorage.getItem("userRole") === "seller");
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load products for navbar search", error);
      }
    };

    loadProducts();
    window.addEventListener("storage", syncAuthState);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setIsSeller(false);
    setIsMenuOpen(false);
    navigate("/", { replace: true });
    window.location.reload();
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const goToProduct = (productId: string) => {
    setSearchTerm("");
    navigate(`/product/${productId}`);
  };

  return (
    <nav className="navbar">
      <a href="/" className="navbar__brand">
        Store
      </a>

      <div className="navbar__search">
        <div className="navbar__search-wrap">
          <svg
            viewBox="0 0 24 24"
            className="navbar__search-icon"
            aria-hidden="true"
          >
            <path d="M10.5 3a7.5 7.5 0 015.94 12.44l4.36 4.36 1.41-1.41-4.36-4.36A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 104.12 9.42A5.5 5.5 0 0010.5 5z" />
          </svg>
          <input
            type="search"
            name="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products"
            className="navbar__search-input"
          />

          {searchTerm.trim() && filteredProducts.length > 0 && (
            <div className="navbar__search-dropdown">
              {filteredProducts.slice(0, 6).map((product) => (
                <button
                  key={product._id}
                  type="button"
                  className="navbar__search-result"
                  onClick={() => goToProduct(product._id)}
                >
                  <span>{product.name}</span>
                  <small>${product.price}</small>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="navbar__actions">
        <button
          type="button"
          className="navbar__button"
          onClick={() => navigate("/cart")}
        >
          Cart
        </button>

        {isLoggedIn ? (
          <div className="navbar__profile-wrapper" ref={menuRef}>
            <button
              type="button"
              className="navbar__profile-button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Open profile menu"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="navbar__dropdown">
                <a href="/profile" className="navbar__dropdown-item">
                  Profile
                </a>

                {isSeller ? (
                  <a href="/manage-store" className="navbar__dropdown-item ">
                    Manage Store
                  </a>
                ) : (
                  <a
                    href="/BecomeSeller"
                    className="navbar__dropdown-item navbar__dropdown-item--seller"
                  >
                    Become a Seller
                  </a>
                )}

                <button
                  type="button"
                  className="navbar__dropdown-item navbar__dropdown-item--danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <a href="/login" className="navbar__link">
            Login
          </a>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
