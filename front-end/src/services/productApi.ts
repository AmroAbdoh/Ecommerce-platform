import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  store?: {
    _id: string;
    name: string;
    logo?: string;
  };
  createdAt?: string;
};

export type ProductInput = {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  images?: string[];
};

export type SellerProductsResponse = {
  count: number;
  products: Product[];
};

export const getAllProducts = async () => {
  const response = await api.get<SellerProductsResponse>("/products");
  return response.data;
};

export const getProductById = async (productId: string) => {
  const response = await api.get<{ product: Product }>(
    `/products/${productId}`,
  );
  return response.data;
};

export const createProduct = async (payload: ProductInput) => {
  const token = localStorage.getItem("token");

  const response = await api.post<{ message: string; product: Product }>(
    "/products",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getSellerProducts = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get<SellerProductsResponse>(
    "/products/my-products",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const updateProduct = async (
  productId: string,
  payload: ProductInput,
) => {
  const token = localStorage.getItem("token");

  const response = await api.patch<{ message: string; product: Product }>(
    `/products/${productId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const deleteProduct = async (productId: string) => {
  const token = localStorage.getItem("token");

  const response = await api.delete<{ message: string }>(
    `/products/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
