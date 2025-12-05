import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IconUpload, IconSettings, IconFileText, IconStars, IconCheck } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { createOrderApi, verifyPaymentApi } from "../api/paymentApi";
import { fetchProfile } from "../redux/authSlice";

function Dreamjob() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ⭐ Always fetch latest profile from DB
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // ⭐ Razorpay Payment Function
  const startPayment = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // 1️⃣ Create Razorpay Order
      const { data: order } = await createOrderApi(user.id, 99);

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Premium Resume Tools",
        description: "Unlock full features",
        order_id: order.orderId,

        handler: async function (response) {
          const verifyData = {
            userId: user.id,
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          };

          // 2️⃣ Verify payment
          const verifyRes = await verifyPaymentApi(verifyData);

          if (verifyRes.data.success) {
            alert("🎉 Payment Successful! Premium Unlocked.");

            // Update Redux with latest profile
            dispatch(fetchProfile());
          } else {
            alert("Payment verification failed!");
          }
        },

        theme: { color: "#ffbd20" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment initialization failed.");
    }
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
          onClick={() =>
            user?.isPremium ? navigate("/resume-tools") : startPayment()
          }
          className="
            mt-6 bg-bright-sun-400 hover:bg-bright-sun-300 
            text-black font-semibold px-6 py-3 rounded-xl 
            flex items-center gap-2 w-fit active:scale-95 transition
          "
        >
          <IconUpload size={22} /> 
          {user?.isPremium ? "Go To Premium Tools" : "Upload Resume"}
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

          {/* ⭐ PREMIUM BUTTON */}
          <button
            onClick={() =>
              user?.isPremium ? navigate("/premium") : startPayment()
            }
            className="
              mt-4 bg-bright-sun-400 text-black text-base sm:text-lg font-semibold 
              p-3 rounded-xl hover:bg-bright-sun-300 
              transition active:scale-95 w-full sm:w-auto
            "
          >
            {user?.isPremium ? "Go To Premium Tools" : "Get Premium for ₹99"}
          </button>

        </div>
      </div>

    </section>
  );
}

export default Dreamjob;
