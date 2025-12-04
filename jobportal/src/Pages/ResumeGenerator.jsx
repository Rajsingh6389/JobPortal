import React, { useEffect, useState } from "react";
import {
  generateResume,
  checkPaid,
  downloadPdf,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../api/api";
import ResumeLoader from "./ResumeLoader";
import Paymentmodal from "./Paymentmodal";

export default function ResumeGenerator() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const [prompt, setPrompt] = useState(
    "Java fresher with Spring Boot and React project experience."
  );
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [resumeId, setResumeId] = useState(null);
  const [paid, setPaid] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId) {
      checkPaid(userId).then(setPaid).catch(() => setPaid(false));
    }
  }, [userId]);

  /* ---------------------------------
        GENERATE RESUME
  ----------------------------------*/
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

  /* ---------------------------------
        PDF DOWNLOAD
  ----------------------------------*/
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

  /* ---------------------------------
        RAZORPAY PAYMENT HANDLER
  ----------------------------------*/
  async function handlePay() {
    setPayLoading(true);
    try {
      const res = await createRazorpayOrder({ userId, amount: 99 });
      const { orderId, amount, currency, keyId } = res.data;

      // Load Razorpay script
      await new Promise((resolve, reject) => {
        if (document.getElementById("rzp-script")) return resolve();
        const script = document.createElement("script");
        script.id = "rzp-script";
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Resume Generator Premium",
        description: "Unlock Resume PDF Download",
        order_id: orderId,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: "#F7C948" },
        handler: async function (response) {
          const verify = await verifyRazorpayPayment({
            userId,
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          if (verify.data.success) {
            setPaid(true);
            setModalOpen(false);
            onDownload();
          } else {
            setError("❌ Payment verification failed.");
          }
        },
      };

      new window.Razorpay(options).open();
    } catch {
      setError("❌ Payment failed.");
    } finally {
      setPayLoading(false);
    }
  }

  /* ---------------------------------
        LOADING SCREEN
  ----------------------------------*/
  if (loading) return <ResumeLoader />;

  if (!userId) {
    return (
      <div className="bg-red-200 p-6 rounded text-red-800 font-semibold">
        Please login to use Resume Generator.
      </div>
    );
  }

  return (
    <div className="bg-mine-shaft-900 text-white p-6 sm:p-10 rounded-2xl shadow-xl border border-mine-shaft-700 max-w-4xl mx-auto">

      {/* HEADER */}
      <h1 className="text-3xl sm:text-4xl font-bold text-bright-sun-300 mb-6 text-center">
        AI Resume Generator ⚡
      </h1>

      {/* PROMPT INPUT */}
      <form onSubmit={onGenerate} className="space-y-3">
        <label className="text-sm text-mine-shaft-300">Resume Prompt</label>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="w-full p-4 rounded-xl bg-mine-shaft-800 border border-mine-shaft-700 focus:border-bright-sun-300 outline-none transition text-mine-shaft-100"
          placeholder="Write details about your experience, skills, project work..."
        ></textarea>

        {/* BUTTONS */}
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
            {paid ? "Download PDF" : "Pay ₹99 & Download"}
          </button>
        </div>
      </form>

      {/* ERROR */}
      {error && (
        <p className="mt-4 text-red-400 text-sm font-semibold">{error}</p>
      )}

      {/* RESUME PREVIEW */}
      {resumeText && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-bright-sun-200 mb-3">
            Resume Preview
          </h3>

          <div
            className="bg-white text-gray-900 p-6 rounded-xl shadow-lg leading-relaxed whitespace-pre-line"
          >
            {resumeText}
          </div>
        </div>
      )}

      {/* PAYMENT POPUP */}
      <Paymentmodal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onPay={handlePay}
        loading={payLoading}
      />
    </div>
  );
}
