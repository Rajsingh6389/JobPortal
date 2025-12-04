import React from "react";
import { IconShieldX, IconArrowBackUp, IconLock } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center items-center bg-mine-shaft-950 px-6 py-10">

      <div
        className="
          bg-mine-shaft-900/80 backdrop-blur-xl 
          p-10 rounded-3xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]
          border border-mine-shaft-800 w-full max-w-lg text-center
          animate-[fadeIn_0.5s_ease-out]
        "
      >
        {/* ICON */}
        <div className="flex justify-center mb-6 animate-[bounce_1.3s_ease-in-out]">
          <IconShieldX
            size={100}
            className="text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.4)]"
          />
        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-red-500 drop-shadow mb-3">
          Access Denied
        </h1>

        {/* MESSAGE */}
        <p className="text-mine-shaft-300 text-lg leading-relaxed">
          You don't have permission to view this page.  
          <br />
          <span className="text-bright-sun-300 font-semibold">
            Admin access
          </span>{" "}
          is required to continue.
        </p>

        {/* Separator */}
        <div className="w-2/3 mx-auto my-7 border-b border-mine-shaft-700"></div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col gap-4 mt-6">

          {/* Back to Home */}
          <button
            onClick={() => navigate("/")}
            className="
              flex items-center justify-center gap-2 py-3 rounded-lg 
              bg-bright-sun-300 text-black font-semibold
              transition-all duration-200
              hover:bg-bright-sun-200 hover:scale-[1.03]
              active:scale-95 shadow-md
            "
          >
            <IconArrowBackUp size={20} /> Go Back to Home
          </button>

          {/* Admin Login */}
          <button
            onClick={() => navigate("/login")}
            className="
              flex items-center justify-center gap-2 py-3 rounded-lg 
              border border-red-500 text-red-400 font-semibold
              transition-all duration-200 
              hover:bg-red-500/20 hover:text-red-300 hover:scale-[1.03]
              active:scale-95
            "
          >
            <IconLock size={18} /> Login with Admin Account
          </button>
        </div>
      </div>
    </div>
  );
}
