import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthInput from "../../components/InputField/Input";
import PrimaryButton from "../../components/Button/Button";
import { forgetPasswordUser } from "../../services/authApi";
import "./AuthPage.css";

function ForgetPassword() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      setIsSubmitting(true);
      const response = await forgetPasswordUser({
        email: formData.email,
        newPassword: formData.newPassword,
      });

      setSuccessMessage(response.message);

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "Something went wrong. Please try again.",
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
            <h1>Bring your garden to life.</h1>
            <p>
              Grow smarter with sustainable tools, beautiful plant care ideas,
              and a more vibrant home.
            </p>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-box">
            <div className="auth-header">
              <h2>Reset password</h2>
              <p>Enter your email and choose a new password.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <AuthInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              <AuthInput
                label="New password"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />

              {errorMessage && (
                <p className="auth-notification error">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="auth-notification success">{successMessage}</p>
              )}

              <PrimaryButton
                label={isSubmitting ? "Updating..." : "Update password"}
                disabled={isSubmitting}
              />

              <p className="auth-footer">
                Remember your password?{" "}
                <button
                  type="button"
                  className="switch-link"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;