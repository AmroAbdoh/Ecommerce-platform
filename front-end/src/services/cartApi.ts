import axios from "axios";
import type { Product } from "./productApi";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Cart = {
  owner: string;
  items: CartItem[];
};

type CartResponse = {
  cart: Cart;
};

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getCart = async () => {
  const response = await api.get<CartResponse>("/cart", authConfig());
  return response.data.cart;
};

export const addToCart = async (productId: string, quantity = 1) => {
  const response = await api.post<CartResponse>(
    "/cart/add",
    { productId, quantity },
    authConfig(),
  );
  return response.data.cart;
};

export const decreaseCartItem = async (productId: string) => {
  const response = await api.patch<CartResponse>(
    `/cart/decrease/${productId}`,
    {},
    authConfig(),
  );
  return response.data.cart;
};

export const removeCartItem = async (productId: string) => {
  const response = await api.delete<CartResponse>(
    `/cart/remove/${productId}`,
    authConfig(),
  );
  return response.data.cart;
};

export const clearCart = async () => {
  const response = await api.delete<CartResponse>("/cart/clear", authConfig());
  return response.data.cart;
};
