import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IconMail,
  IconPhone,
  IconBriefcase,
  IconUser,
  IconDownload,
} from "@tabler/icons-react";

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");

  const fetchApps = async () => {
    try {
      const token = localStorage.getItem("token");
// const BASE_URL = "https://jobportalapplication-production.up.railway.app/api/auth";

      const res = await axios.get(
        "https://jobportalapplication-production.up.railway.app/jobportal/jobs/admin/applications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApps(res.data || []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const filteredApps = apps.filter((a) => {
    const s = search.toLowerCase();

    return (
      a.name?.toLowerCase().includes(s) ||
      a.email?.toLowerCase().includes(s) ||
      a.jobTitle?.toLowerCase().includes(s) ||
      a.company?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="min-h-screen bg-mine-shaft-950 p-6 sm:p-10 text-white">

      {/* HEADER */}
      <h1 className="text-yellow-400 text-4xl mb-6 font-extrabold tracking-wide text-center">
        Job Applications Dashboard
      </h1>

      {/* SEARCH BAR */}
      <div className="max-w-2xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search by name, email, job title, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full p-3 rounded-lg bg-mine-shaft-900 border border-mine-shaft-700
            text-white focus:ring-2 focus:ring-yellow-400 outline-none
          "
        />
      </div>

      {/* APPLICATIONS LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredApps.map((a) => (
          <div
            key={a.id}
            className="
              bg-mine-shaft-900 p-6 rounded-xl border border-mine-shaft-700 shadow-xl
              hover:shadow-yellow-400/20 hover:scale-[1.01] transition-all
              animate-[fadeIn_0.4s_ease-out]
            "
          >
            {/* TOP SECTION */}
            <div className="flex justify-between items-start gap-2">

              {/* USER INFO */}
              <div>
                <h2 className="text-xl font-bold text-yellow-300 flex items-center gap-2">
                  <IconUser size={22} /> {a.name}
                </h2>

                <p className="flex items-center gap-2 text-mine-shaft-300 mt-1 break-all">
                  <IconMail size={18} /> {a.email}
                </p>

                <p className="flex items-center gap-2 text-mine-shaft-300 mt-1">
                  <IconPhone size={18} /> {a.phone || "Not Provided"}
                </p>
              </div>

              {/* JOB INFO */}
              <div className="text-right">
                <p className="text-mine-shaft-400 text-sm">Applied for</p>
                <h3 className="text-lg font-semibold text-bright-sun-300 flex items-center justify-end gap-2">
                  <IconBriefcase size={20} /> {a.jobTitle || "Unknown Job"}
                </h3>
                <p className="text-mine-shaft-500 text-xs mt-1">Job ID: {a.jobId}</p>
              </div>
            </div>

            {/* RESUME BUTTON */}
            <div className="mt-4">
              <a
                href={a.resumeLink || a.resume_link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-bright-sun-300 text-black font-semibold hover:bg-bright-sun-200
                  transition-all shadow-md
                "
              >
                <IconDownload size={20} />
                View Resume
              </a>
            </div>

            {/* DIVIDER */}
            <div className="my-4 border-b border-mine-shaft-700"></div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
              <button className="
                px-4 py-2 bg-green-500/20 text-green-400 rounded-lg 
                font-semibold border border-green-500/40 hover:bg-green-500/30
              ">
                Approve
              </button>

              <button className="
                px-4 py-2 bg-red-500/20 text-red-400 rounded-lg 
                font-semibold border border-red-500/40 hover:bg-red-500/30
              ">
                Reject
              </button>

              <button className="
                px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg 
                font-semibold border border-gray-500/40 hover:bg-gray-500/30
              ">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY MESSAGE */}
      {filteredApps.length === 0 && (
        <p className="text-center text-mine-shaft-400 text-lg mt-10">
          No applications found.
        </p>
      )}
    </div>
  );
}
