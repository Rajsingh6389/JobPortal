import React from "react";
import { work } from "../Data/Data";
import avtimg from "../assets/avatar.png";
import { Avatar } from "@mantine/core";

function Working() {
  return (
    <section className="mt-20 pb-16 px-4 sm:px-8 md:px-16 lg:px-24">

      {/* HEADER */}
      <h2 className="text-center text-3xl sm:text-4xl font-semibold text-mine-shaft-100 mb-3">
        How <span className="text-bright-sun-400">it Works</span>
      </h2>

      <p className="text-center max-w-xl mx-auto text-mine-shaft-300 text-base sm:text-lg mb-10">
        Effortlessly navigate the process and land your dream job.
      </p>

      {/* GRID LAYOUT (IMAGE LEFT / STEPS RIGHT) */}
      <div className="
        grid grid-cols-1 lg:grid-cols-2 
        gap-12 lg:gap-20 items-start
      ">
        
        {/* LEFT IMAGE */}
        <div className="relative flex justify-center">
          <img
            src="/Working/Girl.png"
            alt="Job Portal Illustration"
            className="w-64 sm:w-80 md:w-[22rem] lg:w-[26rem]"
          />

          {/* FLOATING CARD */}
          <div
            className="
              absolute right-2 sm:right-10 top-10 
              bg-mine-shaft-900/80 backdrop-blur-md 
              border border-bright-sun-300/50 
              rounded-xl p-4 flex gap-3 
              shadow-lg
            "
          >
            <Avatar src={avtimg} alt="profile" />

            <div className="text-white">
              <div className="font-semibold text-sm">Complete Your Profile</div>
              <div className="text-xs text-mine-shaft-400">70% Completed</div>
            </div>
          </div>
        </div>

        {/* RIGHT STEPS */}
        <div className="flex flex-col gap-8 pt-4">
          {work.map((item, index) => (
            <div
              key={index}
              className="
                flex items-start gap-4 
                hover:translate-x-2 transition-all
              "
            >
              {/* ICON */}
              <div className="border rounded-full p-3 bg-bright-sun-300 shadow-md">
                <img
                  src={`/Working/${item.icon}.png`}   // dynamic icon
                  alt={item.name}
                  className="w-10 h-10"
                />
              </div>

              {/* TEXT */}
              <div>
                <h3 className="text-mine-shaft-100 text-lg font-semibold">
                  {item.name}
                </h3>
                <p className="text-mine-shaft-400 text-sm">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Working;
