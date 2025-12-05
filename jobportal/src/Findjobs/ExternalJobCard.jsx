import React from "react";
import { IconMapPin, IconClockHour3, IconBuilding } from "@tabler/icons-react";

function ExternalJobCard({ data }) {
  return (
    <div
      className="
        relative group overflow-hidden
        backdrop-blur-xl 
        bg-dark
        border border-white/10 
        shadow-[0_4px_20px_rgba(0,0,0,0.35)]
        p-5 rounded-2xl 
        transition-all duration-500 cursor-pointer 
        hover:scale-[1.03] hover:shadow-[0_6px_35px_rgba(255,255,255,0.15)]
        min-h-[340px] flex flex-col justify-between
      "
    >

      {/* 🌟 Animated white glow effect behind the glass */}
      <div
        className="
          absolute inset-0 opacity-[0.12]
          bg-[radial-gradient(circle_at_center,white,transparent_60%)]
          animate-glassGlow pointer-events-none
        "
      ></div>

      {/* ✨ Shine strip on hover */}
      <div
        className="
          absolute inset-0 h-full w-full 
          bg-gradient-to-r from-transparent via-white/10 to-transparent
          translate-x-[-150%] 
          group-hover:translate-x-[150%] 
          transition-all duration-[1200ms] ease-out
        "
      ></div>

      {/* CONTENT */}
      <div className="relative z-10">

        {/* TOP (LOGO + TITLE) */}
        <div className="flex items-start gap-4">

          {/* LOGO */}
          <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md
                          flex items-center justify-center border border-white/20 overflow-hidden">
            {data.employerLogo ? (
              <img
                src={data.employerLogo}
                className="h-full w-full object-contain"
                onError={(e) => (e.target.src = '/Icons/default.png')}
              />
            ) : (
              <span className="text-bright-sun-300 font-bold text-lg">
                {data.company?.charAt(0)?.toUpperCase()}
              </span>
            )}
          </div>

          {/* TEXT INFO */}
          <div className="flex-1">
            <h3 className="text-white font-semibold text-[15px] leading-tight group-hover:text-bright-sun-300 transition">
              {data.jobTitle}
            </h3>

            <p className="text-gray-300 text-xs flex items-center gap-1 mt-1">
              <IconBuilding size={14} className="opacity-60" /> {data.company}
            </p>
          </div>
        </div>

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-2 py-[3px] text-xs rounded-md 
                           bg-white/10 backdrop-blur-md
                           text-bright-sun-300 
                           flex items-center gap-1 border border-white/20">
            <IconMapPin size={12} /> {data.location}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-200 text-sm mt-3 line-clamp-3">
          {data.description}
        </p>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-bright-sun-300 font-semibold text-sm">
            {data.packageAmount === "Not disclosed"
              ? "Salary Not Disclosed"
              : data.packageAmount}
          </span>

          <span className="text-gray-400 flex items-center gap-1 text-xs">
            <IconClockHour3 size={14} />
            {data.postedDaysAgo}d ago
          </span>
        </div>

        {/* APPLY BUTTON */}
        <button
          onClick={() => window.open(data.applyLink, "_blank")}
          className="
            w-full mt-4 py-2 rounded-xl text-sm font-semibold 
            bg-bright-sun-300 text-black hover:bg-bright-sun-400 
            transition-all duration-200 hover:scale-[1.05]
          "
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default ExternalJobCard;
