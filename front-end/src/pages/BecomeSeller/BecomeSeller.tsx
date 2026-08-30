import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthInput from "../../components/InputField/Input";
import AuthButton from "../../components/Button/Button";
import { becomeSeller, createStore } from "../../services/becomeSellerAPI";
import "../Auth/AuthPage.css";

function BecomeSeller() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.storeName.trim() || !formData.storeDescription.trim()) {
      setErrorMessage("Please provide store name and description");
      return;
    }

    try {
      setIsSubmitting(true);

      // First, upgrade user to seller
      await becomeSeller();

      // Then, create the store
      await createStore(formData.storeName, formData.storeDescription);

      setSuccessMessage("You are now a seller! Your store has been created.");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell auth-page-shell">
      <div className="auth-card">
        <div className="auth-visual">
          <div className="auth-visual-content">
            <h1>Start Your Seller Journey</h1>
            <p>
              Create your store and reach customers. Tell us about your business
              and let&apos;s grow together.
            </p>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-box">
            <div className="auth-header">
              <h2>Become a Seller</h2>
              <p>
                Create your store by providing a name and description. Your
                account will be upgraded to seller status.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <AuthInput
                label="Store Name"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
              />

              <div className="form-group">
                <label htmlFor="storeDescription" className="input-label">
                  Store Description
                </label>
                <textarea
                  id="storeDescription"
                  name="storeDescription"
                  value={formData.storeDescription}
                  onChange={handleChange}
                  placeholder="Tell us about your store and what you offer..."
                  className="auth-textarea"
                  rows={4}
                />
              </div>

              {errorMessage && <p className="auth-error">{errorMessage}</p>}
              {successMessage && (
                <p className="auth-success">{successMessage}</p>
              )}

              <AuthButton
                label={isSubmitting ? "Creating Store..." : "Become a Seller"}
                disabled={isSubmitting}
              />

              <p className="auth-footer">
                Changed your mind?{" "}
                <button
                  type="button"
                  className="switch-link"
                  onClick={() => navigate("/")}
                >
                  Go back home
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BecomeSeller;
