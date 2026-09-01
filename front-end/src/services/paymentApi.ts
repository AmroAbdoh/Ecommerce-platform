import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface PaymentPayload {
  amount: number;
  currency: string;
  paymentMethodId: string;
  cartItems: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface PaymentResponse {
  success: boolean;
  orderId: string;
  message: string;
}

export const processPayment = async (
  payload: PaymentPayload,
): Promise<PaymentResponse> => {
  const { data } = await api.post("/payments/process", payload);
  return data;
};

export const createPaymentIntent = async (amount: number) => {
  const { data } = await api.post("/payments/create-intent", { amount });
  return data;
};
