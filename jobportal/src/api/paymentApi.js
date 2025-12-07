import axios from "axios";

const BASE_URL2 = "https://jobportalserver-production-0346.up.railway.app/api";

const api2 = axios.create({
  baseURL: BASE_URL2,
});

// ⭐ Create Cashfree Order
export const createOrderApi = (userId, amount = 99) =>
  api2.post("/payment/create-order", { userId, amount });

// ⭐ Verify Cashfree Payment
export const verifyPaymentApi = (data) =>
  api2.post("/payment/verify", data);
