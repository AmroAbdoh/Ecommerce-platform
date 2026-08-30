import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthInput from "../../components/InputField/Input";
import AuthButton from "../../components/Button/Button";
import { loginUser, registerUser } from "../../services/authApi";
import "./AuthPage.css";

type AuthMode = "login" | "register";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const isLogin = mode === "login";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

    try {
      setIsSubmitting(true);

      const response = isLogin
        ? await loginUser(payload)
        : await registerUser(payload);

      localStorage.setItem("token", response.token);
      localStorage.setItem("userName", response.user.name);
      navigate("/");
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
              <h2>{isLogin ? "Welcome back" : "Create account"}</h2>
              <p>
                {isLogin
                  ? "Sign in to continue your green journey."
                  : "Start growing your space with smarter choices."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <AuthInput
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              )}

              <AuthInput
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              <AuthInput
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />

              <div className="auth-row">
                <label className="auth-checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                {isLogin && (
                  <a href="/forgetPassword" className="forgot-link">
                    Forgot password?
                  </a>
                )}
              </div>

              {errorMessage && <p className="auth-error">{errorMessage}</p>}

              <AuthButton
                label={
                  isSubmitting
                    ? isLogin
                      ? "Logging in..."
                      : "Creating..."
                    : isLogin
                      ? "Login"
                      : "Register"
                }
                disabled={isSubmitting}
              />

              <p className="auth-footer">
                {isLogin ? "New here? " : "Already have an account? "}
                <button
                  type="button"
                  className="switch-link"
                  onClick={() => {
                    setMode(isLogin ? "register" : "login");
                    setErrorMessage("");
                  }}
                >
                  {isLogin ? "Create an account" : "Login"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
