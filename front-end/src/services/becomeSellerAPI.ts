import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

export type BecomeSellerResponse = {
  message: String;
  role: String;
};

export type StoreResponse = {
  message: String;
  store: {
    _id: String;
    name: String;
    description: String;
    owner: String;
    logo: String;
    isActive: Boolean;
  };
};

export const becomeSeller = async () => {
  const token = localStorage.getItem("token");

  const response = await api.patch<BecomeSellerResponse>(
    "/users/become-seller",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const createStore = async (name: string, description: string) => {
  const token = localStorage.getItem("token");

  const response = await api.post<StoreResponse>(
    "/stores",
    { name, description },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
