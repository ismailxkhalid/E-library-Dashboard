import useTokenStore from "@/store";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useTokenStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login API
export const login = (data: { email: string; password: string }) => {
  return api.post("api/users/login", data);
};

// Sign Up API
export const signUp = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return api.post("api/users/signup", data);
};

// Get Books API
export const getBooks = async () => {
  return api.get("api/books");
};

// Create Book API
export const createBook = async (data: FormData) =>
  api.post("/api/books", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
