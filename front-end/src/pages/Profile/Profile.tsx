import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import PrimaryButton from "../../components/Button/Button";
import "./profile.css";

function Profile() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "customer";
  const userEmail = localStorage.getItem("userEmail") || "user@example.com";

  const handleManageStore = () => {
    navigate("/manage-store");
  };

  const handleBecomeSeller = () => {
    navigate("/BecomeSeller");
  };

  const handleChangePassword = () => {
    navigate("/forgetPassword");
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-card">
          {/* Profile Icon */}
          <div className="profile-icon-wrapper">
            <svg
              viewBox="0 0 24 24"
              className="profile-icon"
              aria-hidden="true"
            >
              <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
            </svg>
          </div>

          {/* User Info */}
          <div className="profile-info">
            <h1 className="profile-name">{userName}</h1>
            <p className="profile-email">{userEmail}</p>
            <span
              className={`profile-role ${
                userRole === "seller" ? "role-seller" : "role-customer"
              }`}
            >
              {userRole === "seller" ? "Seller" : "Customer"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            {userRole === "seller" ? (
              <PrimaryButton
                label="Manage Store"
                type="button"
                onClick={handleManageStore}
              />
            ) : (
              <PrimaryButton
                label="Become a Seller"
                type="button"
                onClick={handleBecomeSeller}
              />
            )}

            <PrimaryButton
              label="Change Password"
              type="button"
              variant="secondary"
              onClick={handleChangePassword}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
