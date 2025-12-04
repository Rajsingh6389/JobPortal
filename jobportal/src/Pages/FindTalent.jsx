import React, { useEffect, useState } from "react";
import { getAllUsersApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { Divider, Badge } from "@mantine/core";
import avtimg from "../assets/avatar-3.png";
import Loader from "../Findjobs/Loader";
import { IconUsers, IconMapPin, IconStar } from "@tabler/icons-react";

export default function FindTalent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await getAllUsersApi();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
    setTimeout(() => setLoading(false), 700);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center bg-mine-shaft-950 text-white">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-mine-shaft-950 text-white px-6 sm:px-10 lg:px-20 py-14 font-Poppins">

      {/* HEADER */}
      <div className="text-center mb-12 animate-[fadeIn_0.6s_ease] space-y-2">
        <h1 className="text-4xl sm:text-5xl font-bold text-bright-sun-300 flex justify-center gap-2 items-center">
          <IconUsers size={42} /> Find Top Talent
        </h1>
        <p className="text-mine-shaft-400 text-base sm:text-lg max-w-2xl mx-auto">
          Explore verified professionals and instantly view their full details, skills & experience.
        </p>
      </div>

      <Divider size="xs" className="mb-10 opacity-40" />

      {/* TALENT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-[fadeIn_0.8s_ease]">

        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => navigate(`/find-talent/user/${user.id}`)}
            className="
              group bg-mine-shaft-900/70 backdrop-blur-xl
              border border-mine-shaft-700 rounded-2xl p-6 cursor-pointer shadow-lg
              hover:shadow-bright-sun-300/25 hover:-translate-y-2 hover:border-bright-sun-300
              transition-all duration-300
            "
          >

            {/* TOP SECTION: AVATAR + BASIC INFO */}
            <div className="flex items-center gap-4">
              <img
                src={user.img || avtimg}
                className="w-16 h-16 rounded-full border-2 border-bright-sun-300 shadow-lg 
                           group-hover:shadow-bright-sun-400/40 group-hover:scale-105 
                           transition-all duration-300"
                alt="profile"
              />

              <div>
                <h2 className="text-xl font-semibold group-hover:text-bright-sun-300 transition">
                  {user.name}
                </h2>

                <p className="text-sm text-mine-shaft-400">
                  {user.role || "No role added"}
                </p>

                <Badge
                  color={user.userType === "ADMIN" ? "red" : "yellow"}
                  variant="light"
                  className="mt-1"
                  size="sm"
                >
                  {user.userType}
                </Badge>
              </div>
            </div>

            {/* LOCATION */}
            <p className="mt-5 flex items-center gap-2 text-mine-shaft-300 text-sm">
              <IconMapPin size={16} className="text-bright-sun-300" />
              {user.location || "Location not added"}
            </p>

            {/* SKILLS */}
            <div className="mt-4 flex flex-wrap gap-2">
              {(user.skills?.split(",") || []).slice(0, 6).map((skill, i) => (
                <span
                  key={i}
                  className="
                    px-2.5 py-1 text-xs rounded-lg bg-mine-shaft-800 border border-mine-shaft-700 
                    group-hover:border-bright-sun-300/60 transition-all duration-300
                  "
                >
                  {skill.trim()}
                </span>
              ))}

              {user.skills?.split(",").length > 6 && (
                <span className="text-xs text-bright-sun-300 font-semibold">
                  + more
                </span>
              )}
            </div>

            {/* RATING — STATIC FOR NOW (Can be dynamic later) */}
            <div className="flex items-center gap-1 text-bright-sun-300 mt-5">
              <IconStar size={18} /> 
              <span className="text-sm">Highly Recommended</span>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
