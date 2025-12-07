import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IconUpload, IconSettings, IconFileText, IconStars, IconCheck } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { createOrderApi, verifyPaymentApi } from "../api/paymentApi";
import { fetchProfile } from "../redux/authSlice";
import { checkPaid } from "../api/api";

export default function Dreamjob() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxUser = useSelector((state) => state.auth.user);
  const [localUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const user = reduxUser || localUser;
  const userId = user?.id;

  const [paid, setPaid] = useState(false);
  const [loadingPaid, setLoadingPaid] = useState(true);

  // Fetch user profile on mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Check payment status
  useEffect(() => {
    if (!userId) {
      setPaid(false);
      setLoadingPaid(false);
      return;
    }

    let active = true;

    (async () => {
      try {
        const isPaid = await checkPaid(userId);
        if (active) setPaid(Boolean(isPaid));
      } catch {
        if (active) setPaid(false);
      } finally {
        if (active) setLoadingPaid(false);
      }
    })();

    return () => (active = false);
  }, [userId]);

  // ======================================================
  // 🚀 START PAYMENT — CASHFREE V3 SDK (100% FIXED)
  // ======================================================
  const startPayment = useCallback(async () => {
    const activeUser = reduxUser || localUser;

    if (!activeUser) {
      navigate("/login");
      return;
    }

    try {
      // 1️⃣ Create order (backend)
      const { data: order } = await createOrderApi(activeUser.id, 99);

      console.log("📩 Raw Cashfree Response:", order.cashfreeResponse);

      const cfRes = JSON.parse(order.cashfreeResponse);

      if (!cfRes.payment_session_id) {
        alert("No payment session returned.");
        return;
      }

      // 2️⃣ Ensure Cashfree SDK loaded
      if (!window.Cashfree) {
        console.error("Cashfree SDK NOT found in window.");
        alert("Cashfree SDK failed to load.");
        return;
      }

      // 3️⃣ Initialize Cashfree instance
      const cf = window.Cashfree({ mode: "production" });

      // 4️⃣ START CHECKOUT
      cf.checkout({
        paymentSessionId: cfRes.payment_session_id,
        redirectTarget: "_self"
      });

    } catch (err) {
      console.error("Payment start failed:", err);
      alert("Payment failed.");
    }
  }, [reduxUser, localUser, navigate]);

  // ======================================================
  // 🔄 VERIFY PAYMENT AFTER REDIRECT
  // ======================================================
  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get("order_id");
    if (!orderId || !userId) return;

    (async () => {
      try {
        const res = await verifyPaymentApi({ userId, orderId });

        if (res.data.success) {
          alert("🎉 Payment Successful!");

          dispatch(fetchProfile());

          const isPaid = await checkPaid(userId).catch(() => false);
          setPaid(Boolean(isPaid));
        }
      } catch (err) {
        console.error("Payment verification error:", err);
      }
    })();
  }, [userId, dispatch]);

  // ======================================================
  // BUTTON HANDLERS
  // ======================================================
  const goOrPay = () => {
    if (user?.isPremium || paid) navigate("/resume-tools");
    else startPayment();
  };

  const premiumBtnHandler = () => {
    if (user?.isPremium || paid) navigate("/premium");
    else startPayment();
  };

  // ======================================================
  // UI SECTION
  // ======================================================
  return (
    <section
      className="
        px-6 sm:px-10 md:px-16 lg:px-20
        py-16 lg:py-24
        flex flex-col lg:flex-row
        justify-between items-center gap-12 lg:gap-20
      "
    >
      {/* LEFT SECTION */}
      <div className="w-full lg:w-1/2 space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
          Unlock <span className="text-bright-sun-400">Premium</span> Resume Tools
        </h1>

        <p className="text-mine-shaft-300 text-base sm:text-lg max-w-md">
          Upload your resume and instantly generate stunning ATS-friendly templates with AI-powered enhancement.
        </p>

        <div className="space-y-4">
          {[
            "AI-powered Resume Enhancement",
            "Convert Resume into 10+ Modern Templates",
            "ATS Score Analyzer & Improvements",
            "Instant PDF Export in High Quality"
          ].map((feature, index) => (
            <div key={index} className="flex items-start sm:items-center gap-3 text-mine-shaft-200">
              <IconCheck size={22} className="text-bright-sun-400" />
              <span className="text-sm sm:text-base">{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={goOrPay}
          className="
            mt-6 bg-bright-sun-400 hover:bg-bright-sun-300
            text-black font-semibold px-6 py-3 rounded-xl
            flex items-center gap-2 w-fit active:scale-95 transition
          "
        >
          <IconUpload size={22} />
          {(user?.isPremium || paid)
            ? "Go To Premium Tools"
            : (loadingPaid ? "Checking..." : "Upload Resume")}
        </button>
      </div>

      {/* RIGHT SECTION */}
      <div
        className="
          relative group overflow-hidden
          w-full lg:w-1/2
          bg-white/5 backdrop-blur-xl
          border border-white/15 rounded-2xl
          p-6 sm:p-8
          shadow-[0_4px_20px_rgba(0,0,0,0.4)]
          transition-all duration-500
          hover:shadow-[0_6px_35px_rgba(255,215,0,0.2)]
          hover:scale-[1.02]
        "
      >
        <div className="relative z-10 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">Premium Plan</h2>

          <p className="text-mine-shaft-300 text-sm sm:text-base">
            Unlock all resume tools, templates, and AI features.
          </p>

          <div className="text-bright-sun-400 text-4xl sm:text-5xl font-bold">₹99</div>
          <p className="text-mine-shaft-400 text-sm sm:text-base">
            One-time payment — lifetime access
          </p>

          <hr className="border-white/20" />

          <div className="space-y-4">
            {[
              { icon: IconStars, label: "All Resume Templates Unlocked" },
              { icon: IconFileText, label: "AI Resume Writer + Summary Generator" },
              { icon: IconSettings, label: "ATS Keyword Optimization" }
            ].map((item, i) => (
              <div key={i} className="flex items-start sm:items-center gap-3 text-white">
                <item.icon size={22} className="text-bright-sun-400" />
                <span className="text-sm sm:text-base">{item.label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={premiumBtnHandler}
            className="
              mt-4 bg-bright-sun-400 text-black text-base sm:text-lg font-semibold
              p-3 rounded-xl hover:bg-bright-sun-300
              transition active:scale-95 w-full sm:w-auto
            "
          >
            {(user?.isPremium || paid)
              ? "Go To Premium Tools"
              : (loadingPaid ? "Checking..." : "Get Premium for ₹99")}
          </button>
        </div>
      </div>
    </section>
  );
}
