import React from "react";
import {
  IconUsers,
  IconTarget,
  IconRocket,
  IconBriefcase,
  IconSchool,
} from "@tabler/icons-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-mine-shaft-950 text-white px-6 py-20 sm:px-10 md:px-16 lg:px-24">
      
      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center animate-[fadeIn_0.6s_ease-out]">
        <h1 className="text-3xl sm:text-4xl font-bold text-bright-sun-300 mb-4">
          About Our Job Platform
        </h1>
        <p className="text-mine-shaft-300 text-base sm:text-lg leading-relaxed">
          This project is created as part of our college curriculum by a passionate team of  
          3rd-year B.Tech CSE students.  
          Our mission is to build a modern, smart, and efficient job portal that connects  
          students and professionals to top companies.
        </p>
      </div>

      {/* STATS SECTION */}
      <div className="max-w-5xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[ 
          { icon: <IconUsers size={40} />, count: "10,000+", label: "Active Users" },
          { icon: <IconBriefcase size={40} />, count: "5000+", label: "Jobs Posted" },
          { icon: <IconRocket size={40} />, count: "1200+", label: "Companies Hiring" },
        ].map((stat, i) => (
          <div
            key={i}
            className="
              bg-mine-shaft-900 p-8 rounded-xl border border-mine-shaft-800 text-center
              hover:shadow-lg hover:scale-[1.03] transition-all duration-300
            "
          >
            <div className="text-bright-sun-300 mx-auto">{stat.icon}</div>
            <h2 className="text-3xl font-bold mt-3">{stat.count}</h2>
            <p className="text-mine-shaft-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* MISSION + VISION */}
      <div className="max-w-4xl mx-auto mt-20 bg-mine-shaft-900 p-8 rounded-xl border border-mine-shaft-800 shadow-lg">
        
        {/* Mission */}
        <div>
          <h2 className="text-2xl font-bold text-bright-sun-300 flex items-center gap-2">
            <IconTarget size={28} /> Our Mission
          </h2>
          <p className="text-mine-shaft-300 mt-3 leading-relaxed">
            To provide an intuitive, fast, and reliable job platform that helps job seekers  
            discover opportunities aligned with their skills and career aspirations.
          </p>
        </div>

        {/* Vision */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-bright-sun-300 flex items-center gap-2">
            <IconRocket size={28} /> Our Vision
          </h2>
          <p className="text-mine-shaft-300 mt-3 leading-relaxed">
            To become a leading job portal equipped with AI-powered job recommendations,  
            student-focused tools, and a seamless hiring experience for companies and candidates.
          </p>
        </div>
      </div>

      {/* TEAM SECTION */}
      <div className="max-w-5xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-bright-sun-300 text-center mb-10 flex items-center justify-center gap-2">
          <IconSchool size={32} /> Meet Our Team
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Raj Singh",
              role: "Full Stack Developer",
              desc: "Expert in backend development, Java, Spring Boot, authentication, and system design.",
            },
            {
              name: "Riya Upadhyay",
              role: "Frontend Developer",
              desc: "Specializes in React, UI/UX design, and building elegant responsive interfaces.",
            },
            {
              name: "Ritesh Singh",
              role: "Database & API Engineer",
              desc: "Handles database design, API integration, and deployment configuration.",
            },
          ].map((member, i) => (
            <div
              key={i}
              className="
                bg-mine-shaft-900 p-6 rounded-xl border border-mine-shaft-800
                text-center hover:scale-[1.03] hover:shadow-lg transition-all duration-300
              "
            >
              <h3 className="text-xl font-bold text-white">{member.name}</h3>
              <p className="text-bright-sun-300 font-semibold">{member.role}</p>
              <p className="text-mine-shaft-400 mt-2 leading-relaxed">
                {member.desc}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-mine-shaft-400 mt-10 text-base sm:text-lg">
          We are proud 3rd-year B.Tech CSE students dedicated to building real-world  
          software solutions and continuously improving our development skills.
        </p>
      </div>

      {/* FOOTER */}
      <div className="text-center text-mine-shaft-500 mt-24">
        <p>© {new Date().getFullYear()} JobNest — Developed by Raj, Riya & Ritesh</p>
      </div>
    </div>
  );
}
