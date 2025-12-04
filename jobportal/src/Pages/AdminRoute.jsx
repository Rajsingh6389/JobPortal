import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  // Check from Redux first, fallback to localStorage
  const reduxType = useSelector((state) => state.auth.userType);
  const lsType = localStorage.getItem("userType");

  const userType = reduxType || lsType;

  console.log("🔍 Checking Admin Access:", userType);

  // BLOCK NON-ADMINS
  if (userType !== "ADMIN") {
    console.log("⛔ ACCESS DENIED — User is not ADMIN");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("✅ ACCESS GRANTED — ADMIN Verified");
  return children;
}
