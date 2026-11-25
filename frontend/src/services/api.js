
import axios from "axios";

const api = axios.create({
  baseURL: "https://smartstock-backend-r5xq.onrender.com/api",
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 30000
});

api.interceptors.request.use(
  (config) => {
    const isLoginRequest =
  config.url?.includes("/auth/admin/login");

if (isLoginRequest) {
  delete config.headers.Authorization;
} else {
  const token = sessionStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
}

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
