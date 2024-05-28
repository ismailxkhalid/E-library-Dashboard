import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = (data: { email: string; password: string }) => {
  return api.post("api/users/login", data);
};
