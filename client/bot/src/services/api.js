import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://multi-agent-1-3kas.onrender.com";

const api = axios.create({
  baseURL: `${API_BASE_URL.replace(/\/$/, "")}/api`,
});

// Automatically attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

