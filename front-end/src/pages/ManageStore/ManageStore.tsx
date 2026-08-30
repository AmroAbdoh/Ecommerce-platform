import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Button from "../../components/Button/Button";
import {
  createProduct,
  deleteProduct,
  getSellerProducts,
  updateProduct,
  type Product,
} from "../../services/productApi";

type ProductFormState = {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
};

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: 0,
  category: "Other",
  stock: 0,
};

function ManageStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<ProductFormState>(emptyForm);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getSellerProducts();
      setProducts(data.products || []);
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load your products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const startEdit = (product: Product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const saveProduct = async () => {
    try {
      await createProduct({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
      });

      setShowCreateForm(false);
      setFormData(emptyForm);
      await loadProducts();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create product");
    }
  };

  const saveEdit = async (productId: string) => {
    try {
      await updateProduct(productId, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
      });

      setEditingId(null);
      setFormData(emptyForm);
      await loadProducts();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update product");
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      await loadProducts();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 36 }}>Manage Your Store</h1>
            <p style={{ margin: "8px 0 0", color: "#666" }}>
              View and manage all your products
            </p>
          </div>

          <Button
            label="Add Product"
            type="button"
            onClick={() => {
              setShowCreateForm((prev) => !prev);
              if (!showCreateForm) {
                setFormData(emptyForm);
              }
            }}
          />
        </div>

        {showCreateForm && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e5e5",
              borderRadius: 16,
              padding: 20,
              marginBottom: 30,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Add New Product</h3>

            <div style={{ display: "grid", gap: 12 }}>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Product name"
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                }}
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                rows={3}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                }}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                  }}
                />
                <input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Stock"
                  style={{
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1px solid #ddd",
                  }}
                />
              </div>

              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                }}
              >
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Gaming">Gaming</option>
                <option value="Home">Home</option>
                <option value="Other">Other</option>
              </select>

              <div style={{ display: "flex", gap: 10 }}>
                <Button
                  label="Create Product"
                  type="button"
                  onClick={saveProduct}
                />
                <Button
                  label="Cancel"
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData(emptyForm);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {loading && <p>Loading your products...</p>}

        {error && (
          <div
            style={{
              background: "#ffe6e6",
              color: "#b42318",
              padding: "12px 16px",
              borderRadius: 8,
              marginBottom: 20,
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div
            style={{
              background: "#f7f7f7",
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              padding: 24,
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: 8 }}>No products yet</h3>
            <p style={{ margin: 0, color: "#666" }}>
              Start by adding your first product to your store.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {products.map((product) => {
              const isEditing = editingId === product._id;

              return (
                <div
                  key={product._id}
                  style={{
                    border: "1px solid #e5e5e5",
                    borderRadius: 16,
                    padding: 16,
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      height: 180,
                      background: "linear-gradient(135deg, #f5f5f5, #e7e7e7)",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#666",
                      fontSize: 14,
                      marginBottom: 16,
                    }}
                  >
                    {product.images && product.images.length > 0
                      ? "Product Image"
                      : "No Image"}
                  </div>

                  {isEditing ? (
                    <div style={{ display: "grid", gap: 10 }}>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Product name"
                        style={{
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px solid #ddd",
                        }}
                      />

                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        rows={3}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px solid #ddd",
                        }}
                      />

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 10,
                        }}
                      >
                        <input
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="Price"
                          style={{
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #ddd",
                          }}
                        />
                        <input
                          name="stock"
                          type="number"
                          value={formData.stock}
                          onChange={handleInputChange}
                          placeholder="Stock"
                          style={{
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #ddd",
                          }}
                        />
                      </div>

                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        style={{
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px solid #ddd",
                        }}
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Books">Books</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Home">Home</option>
                        <option value="Other">Other</option>
                      </select>

                      <div style={{ display: "flex", gap: 10 }}>
                        <Button
                          label="Save"
                          type="button"
                          variant="primary"
                          onClick={() => saveEdit(product._id)}
                        />
                        <Button
                          label="Cancel"
                          type="button"
                          variant="secondary"
                          onClick={() => setEditingId(null)}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                        }}
                      >
                        <h3 style={{ margin: 0, fontSize: 20 }}>
                          {product.name}
                        </h3>
                        <span
                          style={{
                            fontWeight: 700,
                            color: "#1a7f5a",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ${product.price}
                        </span>
                      </div>

                      <p style={{ color: "#666", margin: "10px 0" }}>
                        {product.description}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 14,
                          color: "#555",
                          marginBottom: 16,
                        }}
                      >
                        <span>Category: {product.category}</span>
                        <span>Stock: {product.stock}</span>
                      </div>

                      <div style={{ display: "flex", gap: 10 }}>
                        <Button
                          label="Edit"
                          type="button"
                          variant="primary"
                          onClick={() => startEdit(product)}
                        />
                        <Button
                          label="Delete"
                          type="button"
                          variant="danger"
                          onClick={() => handleDelete(product._id)}
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default ManageStore;
