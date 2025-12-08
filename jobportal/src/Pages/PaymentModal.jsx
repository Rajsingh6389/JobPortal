import React from "react";

export default function PaymentModal({ open, onClose, onPay, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-mine-shaft-900 text-white rounded-xl shadow-xl w-full max-w-md p-6 border border-white/10">

        <h2 className="text-2xl font-bold text-bright-sun-300 mb-3">
          Get Premium Access
        </h2>

        <p className="text-mine-shaft-300 text-sm mb-6">
          Pay <span className="text-bright-sun-400 font-semibold">₹29</span> once and unlock
          unlimited resume downloads forever.
        </p>

        <div className="flex items-center gap-3">
          
          {/* PAY BUTTON */}
          <button
            onClick={onPay}
            disabled={loading}
            className="
              px-5 py-2.5 
              bg-bright-sun-400 text-black 
              rounded-lg font-semibold 
              hover:bg-bright-sun-300 
              transition disabled:opacity-50
            "
          >
            {loading ? "Processing..." : "Pay ₹29"}
          </button>

          {/* CANCEL BUTTON */}
          <button
            onClick={onClose}
            className="
              px-5 py-2.5 
              border border-white/20 
              text-white rounded-lg 
              hover:bg-white/10 transition
            "
          >
            Cancel
          </button>

        </div>
      </div>
    </div>
  );
}
