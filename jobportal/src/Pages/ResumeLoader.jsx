import React from "react";

export default function ResumeLoader() {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fadeIn">

      {/* Glow Ring Loader */}
      <div className="relative">
        <div className="w-24 h-24 border-4 border-bright-sun-300/40 rounded-full animate-ping absolute"></div>
        <div className="w-20 h-20 border-4 border-t-bright-sun-300 border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
      </div>

      {/* Loading Text */}
      <p className="mt-6 text-2xl font-semibold bg-gradient-to-r from-bright-sun-200 to-bright-sun-400 bg-clip-text text-transparent animate-pulse tracking-wider">
        Generating your resume...
      </p>

      {/* Custom Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
