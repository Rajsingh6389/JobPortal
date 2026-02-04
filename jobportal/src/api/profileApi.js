import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL: "http://65.1.132.98:8080/api",

});

// Add TOKEN
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// CORRECT ENDPOINTS (NO TRAILING SLASH)
export const getProfileApi = () => API.get("/profile");
export const updateProfileApi = (data) => API.put("/profile/update", data);
