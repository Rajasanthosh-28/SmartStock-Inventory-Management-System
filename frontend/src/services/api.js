
import axios from "axios";

const api = axios.create({
  baseURL: "https://smartstock-backend-r5xq.onrender.com/api",
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 30000
});

// Automatically attach the admin JWT token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
