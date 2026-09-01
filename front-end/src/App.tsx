import { BrowserRouter } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AppRoutes from "./routes";

// Initialize Stripe
// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder",
);

function App() {
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <AppRoutes />
      </Elements>
    </BrowserRouter>
  );
}

export default App;
