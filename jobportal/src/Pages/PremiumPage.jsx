import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createOrderApi, verifyPaymentApi } from "../api/paymentApi";
import { fetchProfile } from "../redux/authSlice";
import { IconFileText, IconSettings, IconStars, IconUpload } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { checkPaid } from "../api/api";

function PremiumPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reduxUser = useSelector((s) => s.auth.user);

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

  // Fetch latest profile
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Check payment status
  useEffect(() => {
    let mounted = true;
    async function loadPaid() {
      if (!userId) {
        setPaid(false);
        setLoadingPaid(false);
        return;
      }

      try {
        setLoadingPaid(true);
        const isPaid = await checkPaid(userId);
        if (mounted) setPaid(!!isPaid);
      } catch {
        if (mounted) setPaid(false);
      } finally {
        if (mounted) setLoadingPaid(false);
      }
    }
    loadPaid();
    return () => (mounted = false);
  }, [userId]);

  // Payment logic
  const startPayment = useCallback(async () => {
    if (!user) return alert("Please login first.");

    if (!window.Razorpay) {
      return alert("Razorpay SDK not loaded.");
    }

    try {
      const res = await createOrderApi(user.id, 99);
      const { orderId, amount, keyId, currency } = res.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Premium Plan",
        description: "Unlock AI Resume Tools + Templates",
        order_id: orderId,
        prefill: { name: user.name, email: user.email },
        theme: { color: "#FFD53D" },

        handler: async (response) => {
          const payload = {
            userId: user.id,
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          };

          const verifyRes = await verifyPaymentApi(payload);

          if (verifyRes.data.success) {
            alert("Premium Activated!");
            dispatch(fetchProfile());

            const isPaid = await checkPaid(user.id).catch(() => false);
            setPaid(!!isPaid);
          } else {
            alert("Payment verification failed!");
          }
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong during payment.");
    }
  }, [user, dispatch]);

  const isPremium = user?.isPremium || paid;

  const premiumTools = [
    {
      title: "AI Resume Builder",
      desc: "Create ATS-friendly resumes instantly using AI.",
      icon: IconStars,
      path: "/ai-resume-builder",
    },
    {
      title: "Premium Templates",
      desc: "Select from 10+ beautifully designed resume templates.",
      icon: IconFileText,
      path: "/premium-templates",
    },
    {
      title: "ATS Score Analyzer",
      desc: "Improve your resume visibility with ATS analysis.",
      icon: IconSettings,
      path: "/ats-score",
    },
    {
      title: "HD PDF Export",
      desc: "Download polished, high-quality resume PDFs.",
      icon: IconUpload,
      path: "/pdf-export",
    },
  ];

  return (
    <div className="text-white px-5 sm:px-10 py-10 max-w-7xl mx-auto">

      <div className="text-center mb-12 space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
          {isPremium ? "🎉 Premium Tools Unlocked!" : "Get Premium – ₹99 Only"}
        </h1>

        <p className="text-gray-300 text-base sm:text-lg">
          {isPremium
            ? "Enjoy lifetime access to all AI-powered resume tools."
            : "Unlock AI resume builder, templates, ATS scoring, and more."}
        </p>

        {!isPremium && loadingPaid && (
          <p className="text-yellow-400 text-sm mt-2">Checking premium status...</p>
        )}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {premiumTools.map((tool, i) => (
          <div
            key={i}
            className="
              relative overflow-hidden group
              backdrop-blur-xl bg-white/5 
              border border-white/20 
              shadow-[0_10px_40px_rgba(0,0,0,0.25)]
              p-6 rounded-2xl 
              transition-all duration-500 
              min-h-[260px] flex flex-col justify-between
              hover:scale-[1.05] hover:border-yellow-400/40
              hover:shadow-[0_15px_45px_rgba(255,215,0,0.25)]
            "
          >
            <tool.icon className="text-yellow-400 z-10" size={45} />

            <div className="z-10">
              <h2 className="text-xl sm:text-2xl font-bold mt-4">{tool.title}</h2>
              <p className="text-gray-300 mt-2 text-sm sm:text-base">{tool.desc}</p>
            </div>

            <button
              onClick={() => (isPremium ? navigate(tool.path) : startPayment())}
              className={`
                mt-4 px-4 py-2 rounded-lg font-semibold transition z-10 w-full sm:w-auto
                ${
                  isPremium
                    ? "bg-yellow-400 text-black hover:bg-yellow-300"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }
              `}
            >
              {isPremium ? "Open Tool" : "Unlock Premium"}
            </button>
          </div>
        ))}
      </div>

      {!isPremium && (
        <div className="text-center mt-12">
          <button
            onClick={startPayment}
            className="
              px-10 py-4 bg-yellow-400 text-black font-bold rounded-xl 
              hover:bg-yellow-300 transition shadow-[0_8px_20px_rgba(255,215,0,0.3)]
              text-lg
            "
          >
            Buy Premium for ₹99
          </button>
        </div>
      )}
    </div>
  );
}

export default PremiumPage;
