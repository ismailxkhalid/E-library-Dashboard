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

// Update Book API
export const updateBook = async (_id: string, data: FormData) =>
  api.patch(`/api/books/${_id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Delete Book API
export const deleteBook = async (_id: string) =>
  api.delete(`/api/books/${_id}`);
