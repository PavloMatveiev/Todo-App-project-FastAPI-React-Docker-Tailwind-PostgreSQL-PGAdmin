import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const api = axios.create({ baseURL });

const token = localStorage.getItem("token");
if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
