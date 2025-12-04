import React from "react";

export default function PaymentModal({ open, onClose, onPay, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h3 className="text-xl font-semibold mb-2">Pay ₹99 to download</h3>
        <p className="text-sm text-gray-600 mb-4">
          This is a mock payment flow. Replace with Razorpay or your real gateway for production.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onPay}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Processing..." : "Pay ₹99"}
          </button>
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
