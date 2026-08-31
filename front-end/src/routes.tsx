import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Auth/Login";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import Home from "./pages/Home/Home";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Profile from "./pages/Profile/Profile";
import BecomeSeller from "./pages/BecomeSeller/BecomeSeller";
import ManageStore from "./pages/ManageStore/ManageStore";
import Cart from "./pages/Cart/Cart";

const isAuthenticated = () => Boolean(localStorage.getItem("token"));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
      <Route
        path="/Profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/BecomeSeller"
        element={
          <ProtectedRoute>
            <BecomeSeller />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-store"
        element={
          <ProtectedRoute>
            <ManageStore />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
