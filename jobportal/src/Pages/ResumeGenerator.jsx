import React, { useEffect, useState, useCallback } from "react";
import {
  generateResume,
  downloadPdf
} from "../api/api"; // your existing APIs

import {
  createOrderApi,
  verifyPaymentApi,
  checkPaid
} from "../api/paymentApi"; // CASHFREE APIs

import ResumeLoader from "./ResumeLoader";
import PaymentModal from "./PaymentModal";

export default function ResumeGenerator() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const [prompt, setPrompt] = useState(
    "Java fresher with Spring Boot and React project experience."
  );
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [resumeId, setResumeId] = useState(null);

  const [paid, setPaid] = useState(false);
  const [loadingPaid, setLoadingPaid] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  /* ---------------------------------------------------
      1️⃣ Check Payment Status on Page Load
  --------------------------------------------------- */
  useEffect(() => {
    if (!userId) {
      setPaid(false);
      setLoadingPaid(false);
      return;
    }

    (async () => {
      try {
        const isPaid = await checkPaid(userId);
        setPaid(Boolean(isPaid));
      } catch {
        setPaid(false);
      } finally {
        setLoadingPaid(false);
      }
    })();
  }, [userId]);

  /* ---------------------------------------------------
      2️⃣ Generate Resume
  --------------------------------------------------- */
  async function onGenerate(e) {
    e.preventDefault();

    if (!userId) return setError("Please login first.");

    setError("");
    setLoading(true);
    setResumeText("");
    setResumeId(null);

    try {
      const data = await generateResume({ userId, prompt });
      setResumeText(data.resumeText || "");
      setResumeId(data.resumeId || null);
    } catch {
      setError("❌ Failed to generate resume.");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------------------------------------------
      3️⃣ Download Resume (Premium Feature)
  --------------------------------------------------- */
  async function onDownload() {
    if (!resumeId) return setError("Generate a resume first.");

    const isPaid = await checkPaid(userId).catch(() => false);
    setPaid(isPaid);

    if (!isPaid) {
      setModalOpen(true);
      return;
    }

    try {
      const blob = await downloadPdf(userId, resumeId);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${resumeId}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch {
      setError("❌ Download failed.");
    }
  }

  /* ---------------------------------------------------
      4️⃣ Start Cashfree Payment (Same as Dreamjob)
  --------------------------------------------------- */
  const startPayment = useCallback(async () => {
    if (!userId) {
      alert("Please login first.");
      return;
    }

    try {
      // 1) Create order
      const { data: order } = await createOrderApi(userId, 29);

      console.log("📩 ResumeGenerator Cashfree Order:", order.cashfreeResponse);

      const cfRes = JSON.parse(order.cashfreeResponse);

      if (!cfRes.payment_session_id) {
        alert("Cashfree did not return payment_session_id");
        return;
      }

      // 2) Ensure SDK exists
      if (!window.Cashfree) {
        alert("Cashfree SDK not loaded");
        return;
      }

      // 3) Initialize
      const cf = window.Cashfree({ mode: "production" });

      // 4) Start checkout
      cf.checkout({
        paymentSessionId: cfRes.payment_session_id,
        redirectTarget: "_self",
      });

    } catch (err) {
      console.error("Payment failed:", err);
      alert("Payment failed");
    }
  }, [userId]);

  /* ---------------------------------------------------
      5️⃣ VERIFY PAYMENT AFTER REDIRECT
         (Same logic as Dreamjob)
  --------------------------------------------------- */
  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get("order_id");

    if (!orderId || !userId) return;

    (async () => {
      try {
        console.log("Verifying Payment:", { userId, orderId });

        const res = await verifyPaymentApi({ userId, orderId });

        if (res.data.success) {
          alert("🎉 Payment Successful!");

          // update UI
          setPaid(true);
          setModalOpen(false);

          if (resumeId) onDownload();
        }
      } catch (err) {
        console.error("Payment verification error:", err);
      }
    })();
  }, [userId, resumeId]);

  /* ---------------------------------------------------
      LOADING SCREEN
  --------------------------------------------------- */
  if (loading) return <ResumeLoader />;

  if (!userId) {
    return (
      <div className="bg-red-200 p-6 rounded text-red-800 font-semibold">
        Please login to use Resume Generator.
      </div>
    );
  }

  /* ---------------------------------------------------
      UI
  --------------------------------------------------- */
  return (
    <div className="bg-mine-shaft-900 text-white p-6 sm:p-10 rounded-2xl shadow-xl border border-mine-shaft-700 max-w-4xl mx-auto">

      <h1 className="text-3xl sm:text-4xl font-bold text-bright-sun-300 mb-6 text-center">
        AI Resume Generator ⚡
      </h1>

      {/* INPUT FORM */}
      <form onSubmit={onGenerate} className="space-y-3">
        <label className="text-sm text-mine-shaft-300">Resume Prompt</label>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full p-4 rounded-xl bg-mine-shaft-800 border border-mine-shaft-700 focus:border-bright-sun-300 outline-none transition text-mine-shaft-100"
        ></textarea>

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            type="submit"
            className="px-5 py-3 bg-bright-sun-300 text-black rounded-lg font-semibold hover:bg-bright-sun-200 transition"
          >
            Generate Resume
          </button>

          <button
            type="button"
            onClick={onDownload}
            disabled={!resumeText}
            className="px-5 py-3 border border-bright-sun-300 text-bright-sun-200 rounded-lg hover:bg-bright-sun-300 hover:text-black transition disabled:opacity-40"
          >
            {paid ? "Download PDF" : "Pay ₹29 & Download"}
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-4 text-red-400 text-sm font-semibold">{error}</p>
      )}

      {resumeText && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-bright-sun-200 mb-3">
            Resume Preview
          </h3>
          <div className="bg-white text-gray-900 p-6 rounded-xl shadow-lg whitespace-pre-line leading-relaxed">
            {resumeText}
          </div>
        </div>
      )}

      {/* Payment Popup */}
      <PaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onPay={startPayment}
      />
    </div>
  );
}
