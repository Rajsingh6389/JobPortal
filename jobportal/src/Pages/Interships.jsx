import React, { useEffect, useState, useMemo } from "react";
import { getInterships } from "../api/JobApi";
import { motion } from "framer-motion";

function Internships() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All");
  const [company, setCompany] = useState("All");

  // Pagination
  const [page, setPage] = useState(1);

  // Load internships
  async function loadInternships(pg = 1) {
    try {
      setLoading(true);
      const arr = await getInterships("developer in india", pg);
      setJobs((prev) => (pg === 1 ? arr.data : [...prev, ...arr.data]));
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load internships. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInternships(1);
  }, []);

  // Create filter lists
  const countryList = useMemo(() => {
    const setC = new Set(jobs.map((j) => j.countries_derived?.[0]).filter(Boolean));
    return ["All", ...setC];
  }, [jobs]);

  const companyList = useMemo(() => {
    const setC = new Set(jobs.map((j) => j.organization).filter(Boolean));
    return ["All", ...setC];
  }, [jobs]);

  // Filtering logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchTitle =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.organization.toLowerCase().includes(search.toLowerCase());

      const matchCountry =
        country === "All" || job.countries_derived?.[0] === country;

      const matchCompany = company === "All" || job.organization === company;

      return matchTitle && matchCountry && matchCompany;
    });
  }, [search, country, company, jobs]);

  return (
    <div className="min-h-screen px-4 sm:px-10 py-10 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">

      {/* PAGE TITLE */}
      <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-700 dark:text-blue-400">
        🌍 Explore Global Internships
      </h1>

      {/* FILTER BAR */}
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-xl p-5 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            className="border px-4 py-2 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-400"
            placeholder="Search by title or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border px-4 py-2 rounded-lg dark:bg-gray-800 dark:text-white"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {countryList.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            className="border px-4 py-2 rounded-lg dark:bg-gray-800 dark:text-white"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          >
            {companyList.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

        </div>
      </div>

      {/* ERROR STATE */}
      {error && (
        <p className="text-center text-red-500 font-semibold mb-5">{error}</p>
      )}

      {/* SKELETON LOADING */}
      {loading && jobs.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse bg-gray-300 dark:bg-gray-700 rounded-xl"
            ></div>
          ))}
        </div>
      )}

      {/* INTERNSHIP GRID */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            className="bg-white dark:bg-gray-900 shadow-xl rounded-xl p-5 border border-gray-200 
                       dark:border-gray-700 hover:-translate-y-2 hover:shadow-2xl transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src={job.organization_logo}
                className="w-12 h-12 rounded-full border dark:border-gray-700 object-cover"
              />
              <div>
                <h2 className="font-semibold dark:text-white">{job.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{job.organization}</p>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-2">
              📍 {job.locations_derived?.[0] || "Location Not Provided"}
            </p>

            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              📅 Posted: {new Date(job.date_posted).toDateString()}
            </p>

            <a
              href={job.external_apply_url || job.url}
              target="_blank"
              className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
            >
              Apply Now →
            </a>
          </motion.div>
        ))}
      </div>

      {/* LOAD MORE BUTTON */}
      {jobs.length >= 10 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => {
              setPage(page + 1);
              loadInternships(page + 1);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Load More Jobs ↓
          </button>
        </div>
      )}
    </div>
  );
}

export default Internships;
