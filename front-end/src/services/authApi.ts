import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

export type AuthRequest = {
  name?: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  user: {
    name: string;
  };
  token: string;
};

export const loginUser = async (payload: AuthRequest) => {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
};

export const registerUser = async (payload: AuthRequest) => {
  const response = await api.post<AuthResponse>("/auth/register", payload);
  return response.data;
};
