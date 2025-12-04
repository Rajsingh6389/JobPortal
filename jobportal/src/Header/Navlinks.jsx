import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navlinks({ mobile = false, onClickItem, loggedIn = false }) {
  const location = useLocation();

  const links = [
    { name: "Find Jobs", url: "/find-jobs" },
    { name: "Find Talent", url: "/find-talent" },
    { name: "Upload Job", url: "/upload-job" },
    { name: "View Applications", url: "/applications" },
    { name: "About Us", url: "/about" },
    { name: "AI Resume", url: "/resume-generator" },
  ];

  // Add Login + Signup ONLY when NOT logged in
  if (!loggedIn) {
    links.push(
      { name: "Login", url: "/login" },
      { name: "Sign Up", url: "/signup" }
    );
  }

  return (
    <nav
      className={
        mobile
          ? "flex flex-col gap-5 text-gray-200"
          : "flex gap-6 items-center text-mine-shaft-300"
      }
    >
      {links.map((link) => {
        const isActive = location.pathname === link.url;

        return (
          <Link
            key={link.url}
            to={link.url}
            onClick={() => {
              if (mobile && onClickItem) onClickItem(); // CLOSE MOBILE MENU
            }}
            className={`group relative font-medium transition-all
              ${mobile ? "text-lg" : "text-sm"}
              ${isActive ? "text-bright-sun-300" : "hover:text-bright-sun-300"}
            `}
          >
            {link.name}

            {/* Underline Animation */}
            <span
              className={`absolute left-0 bottom-[-4px] h-[2px] bg-bright-sun-300 rounded-full transition-all
                ${isActive ? "w-full" : "w-0 group-hover:w-full"}
              `}
            ></span>
          </Link>
        );
      })}
    </nav>
  );
}

export default Navlinks;
