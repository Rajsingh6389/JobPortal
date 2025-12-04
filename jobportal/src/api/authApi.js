import axios from "axios";

// const BASE_URL = "http://localhost:8080/api/auth";
// const BASE_URL2 = "http://localhost:8080/api";
const BASE_URL = "https://jobportalserver-production-0346.up.railway.app/api/auth";
const BASE_URL2 = "https://jobportalserver-production-0346.up.railway.app/api";



// Axios instances
const api = axios.create({
  baseURL: BASE_URL,
});

const api2 = axios.create({
  baseURL: BASE_URL2,
});

// ==========================
// AUTH INTERCEPTOR (api)
// ==========================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // Skip token for login/signup
  if (!config.url.includes("/login") && !config.url.includes("/signup")) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// ==========================
// PROTECTED API INTERCEPTOR (api2)
// ==========================
api2.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ====================
// AUTH API FUNCTIONS
// ====================

// LOGIN
export const loginApi = (data) => api.post("/login", data);

// SIGNUP
export const signupApi = (data) => api.post("/signup", data);

// VALIDATE TOKEN
export const validateTokenApi = () => api.get("/validate");

// LOGOUT
export const logoutApi = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ========================
// PROFILE API (Protected)
// ========================

export const getProfileApi = () => api2.get("/profile");

export const updateProfileApi = (data) =>
  api2.put("/profile/update", data);


export const getAllUsersApi = () => api.get("/all");
