import axios from "axios";

// =========================
// API BASE URLs
// =========================
const BASE_URL ="https://jobportalserver-production-0346.up.railway.app/api";
// Resume / Payment API
// const BASE_URL ="http://localhost:8080/api";

const resumeapi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 120000,
});

// =========================
// RESUME API
// =========================

// Generate Resume (AI)
export async function generateResume({ userId, prompt }) {
  const res = await resumeapi.post("/resume/generate", { userId, prompt });
  return res.data;
}



// Download PDF
export async function downloadPdf(userId, resumeId) {
  const res = await resumeapi.get(`/resume/download`, {
    params: { userId, resumeId },
    responseType: "blob",
  });
  return res.data;
}

// Get all resumes by a user
export async function getResumes(userId) {
  const res = await resumeapi
    .get(`/resumes/by-user`, { params: { userId } })
    .catch(() => ({ data: [] }));
  return res.data || [];
}

// =========================
// RAZORPAY PAYMENT API
// =========================

// Create Razorpay Order
export async function createCashfreeOrder(data) {
  const res = await resumeapi.post("/payment/create-order", data);
  return res;
}

// Verify Razorpay Payment
export async function verifyCashfreePayment(payload) {
  const res = await resumeapi.post("/payment/verify", payload);
  return res;
}

export default resumeapi;
