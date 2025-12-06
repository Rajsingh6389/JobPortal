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

  // Prefer user from Redux; fallback to localStorage
  const reduxUser = useSelector((state) => state.auth.user);
  const [localUser, setLocalUser] = useState(() => {
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

  // Fetch latest profile from DB on mount (and whenever userId changes)
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Check paid status once userId is available
  useEffect(() => {
    let mounted = true;
    async function fetchPaid() {
      if (!userId) {
        setPaid(false);
        setLoadingPaid(false);
        return;
      }
      setLoadingPaid(true);
      try {
        const isPaid = await checkPaid(userId);
        if (mounted) setPaid(Boolean(isPaid));
      } catch (err) {
        console.error("Error checking paid status:", err);
        if (mounted) setPaid(false);
      } finally {
        if (mounted) setLoadingPaid(false);
      }
    }
    fetchPaid();
    return () => { mounted = false; };
  }, [userId]);

  // Payment starter
  const startPayment = useCallback(async () => {
    const activeUser = reduxUser || localUser;
    if (!activeUser) {
      navigate("/login");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK not found. Make sure you added the Razorpay script to index.html.");
      return;
    }

    try {
      // 1) Create order on backend
      const { data: order } = await createOrderApi(activeUser.id, 99);

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Premium Resume Tools",
        description: "Unlock full features",
        order_id: order.orderId,
        handler: async function (response) {
          try {
            const verifyData = {
              userId: activeUser.id,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            };

            const verifyRes = await verifyPaymentApi(verifyData);

            if (verifyRes?.data?.success) {
              alert("🎉 Payment Successful! Premium Unlocked.");
              // Update backend state & redux profile
              dispatch(fetchProfile());
              // Re-check paid state
              const isPaid = await checkPaid(activeUser.id).catch(() => false);
              setPaid(Boolean(isPaid));
            } else {
              alert("Payment verification failed!");
            }
          } catch (err) {
            console.error("Error verifying payment:", err);
            alert("Error verifying payment. Check console.");
          }
        },
        theme: { color: "#ffbd20" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initialization failed:", err);
      alert("Payment initialization failed.");
    }
  }, [reduxUser, localUser, navigate, dispatch]);

  const goOrPay = () => {
    // prefer server-side premium flag if present, otherwise use paid state
    const isPremium = user?.isPremium || paid;
    if (isPremium) {
      navigate("/resume-tools");
    } else {
      startPayment();
    }
  };

  const premiumBtnHandler = () => {
    const isPremium = user?.isPremium || paid;
    if (isPremium) navigate("/premium");
    else startPayment();
  };

  return (
    <section
      className="
        px-6 sm:px-10 md:px-16 lg:px-20 
        py-16 lg:py-24 
        flex flex-col lg:flex-row 
        justify-between items-center gap-12 lg:gap-20
      "
    >
      {/* LEFT SIDE */}
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

        {/* Upload Resume Button */}
        <button
          onClick={goOrPay}
          className="
            mt-6 bg-bright-sun-400 hover:bg-bright-sun-300 
            text-black font-semibold px-6 py-3 rounded-xl 
            flex items-center gap-2 w-fit active:scale-95 transition
          "
        >
          <IconUpload size={22} />
          {(user?.isPremium || paid) ? "Go To Premium Tools" : (loadingPaid ? "Checking..." : "Upload Resume")}
        </button>

      </div>

      {/* RIGHT SIDE — PREMIUM CARD */}
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
        <div
          className="
            absolute inset-0 opacity-[0.12]
            bg-[radial-gradient(circle_at_center,white,transparent_55%)]
            animate-glassGlow pointer-events-none
          "
        ></div>

        <div
          className="
            absolute inset-0 h-full w-full 
            bg-gradient-to-r from-transparent via-white/10 to-transparent
            translate-x-[-150%] 
            group-hover:translate-x-[150%] 
            transition-all duration-[1300ms] ease-out
          "
        ></div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">Premium Plan</h2>
          <p className="text-mine-shaft-300 text-sm sm:text-base">
            Unlock all resume tools, templates, and AI features.
          </p>

          <div className="text-bright-sun-400 text-4xl sm:text-5xl font-bold">₹99</div>
          <p className="text-mine-shaft-400 text-sm sm:text-base">One-time payment — lifetime access</p>

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

          {/* PREMIUM BUTTON */}
          <button
            onClick={premiumBtnHandler}
            className="
              mt-4 bg-bright-sun-400 text-black text-base sm:text-lg font-semibold 
              p-3 rounded-xl hover:bg-bright-sun-300 
              transition active:scale-95 w-full sm:w-auto
            "
          >
            {(user?.isPremium || paid) ? "Go To Premium Tools" : (loadingPaid ? "Checking..." : "Get Premium for ₹99")}
          </button>
        </div>
      </div>
    </section>
  );
}
