import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Auth/Login";
import ForgetPassword from "./pages/Auth/ForgetPassword";

function Home() {
  return <h1>E-Commerce Platform</h1>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
