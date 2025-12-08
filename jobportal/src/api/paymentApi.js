import axios from "axios";

// Backend Base URL (Railway)
const BASE_URL2 = "https://jobportalserver-production-0346.up.railway.app/api";

const api2 = axios.create({
  baseURL: BASE_URL2,
});

// -----------------------------------------------------
// ⭐ CREATE CASHFREE ORDER
// -----------------------------------------------------
export const createOrderApi = (userId, amount = 29) =>
  api2.post("/payment/create-order", { userId, amount });


// -----------------------------------------------------
// ⭐ VERIFY CASHFREE PAYMENT
// -----------------------------------------------------
export const verifyPaymentApi = (data) =>
  api2.post("/payment/verify", data);


// -----------------------------------------------------
// ⭐ CHECK PAID STATUS (used in Dreamjob.jsx)
// -----------------------------------------------------
// -----------------------------------------------------
// ⭐ CHECK PAID STATUS (correct backend route)
// -----------------------------------------------------
export const checkPaid = async (userId) => {
  try {
    const res = await api2.get(`/payment/check-paid/${userId}`);
    return res.data.paid === true;
  } catch (err) {
    console.error("checkPaid error:", err);
    return false;
  }
};

