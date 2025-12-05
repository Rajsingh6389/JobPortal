// OR import axios instance the same way you do above
import axios  from "axios";
// If api2 is not exported, create a new axios() with same BASE_URL2.
const BASE_URL2 = "https://jobportalserver-production-0346.up.railway.app/api";

const api2 = axios.create({ 
    baseURL: BASE_URL2,
  });

export const createOrderApi = (userId, amount = 99) =>
  api2.post("/payment/create-order", { userId, amount });

export const verifyPaymentApi = (data) =>
  api2.post("/payment/verify", data);