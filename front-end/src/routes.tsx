import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Auth/Login";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import Home from "./pages/Home/Home"
import Profile from "./pages/Profile/Profile";
import BecomeSeller from "./pages/BecomeSeller/BecomeSeller";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/BecomeSeller" element={<BecomeSeller />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
