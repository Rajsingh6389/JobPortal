import React, { useState, useEffect } from "react";
import Sort from "./Sort";
import { getAllJobs, getExternalJobs } from "../api/JobApi";
import Jobcard from "./Jobcard";
import ExternalJobCard from "./ExternalJobCard";
import Loader from "./Loader";


function Jobs() {
  const [loading, setLoading] = useState(true);
  const [jobType, setJobType] = useState("internal"); // internal | external

  const [internalJobs, setInternalJobs] = useState([]);
  const [externalJobs, setExternalJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);

    try {
      // INTERNAL JOBS (FROM DB) — DO NOT TOUCH
      const internalRes = await getAllJobs();
      let internalList = [];

      if (Array.isArray(internalRes.data)) internalList = internalRes.data;
      else if (Array.isArray(internalRes.data?.jobs)) internalList = internalRes.data.jobs;
      else if (Array.isArray(internalRes.data?.content)) internalList = internalRes.data.content;
      else if (Array.isArray(internalRes.data?.data)) internalList = internalRes.data.data;

      const formattedInternal = internalList.map(job => ({
        ...job,
        source: "internal",
      }));

      setInternalJobs(formattedInternal);

      // EXTERNAL JOBS (JSEARCH)
      const extRes = await getExternalJobs();
      console.log(extRes);
      
      const extRaw = extRes.data?.data || [];

      const formattedExternal = extRaw.map(job => ({
        
        id: job.job_id,
        jobTitle: job.job_title,
        company: job.employer_name,
        employerLogo: job.employer_logo, // <---- FIX
        location: `${job.job_city || ""}, ${job.job_country || ""}`,
        description: job.job_description,
        packageAmount:
          job.job_min_salary && job.job_max_salary
            ? `${job.job_min_salary} - ${job.job_max_salary}`
            : "Not disclosed",
        postedDaysAgo: job.job_posted_at_timestamp
          ? Math.floor((Date.now() / 1000 - job.job_posted_at_timestamp) / 86400)
          : 0,
        applyLink: job.job_apply_link,
        source: "external"
      }));

      setExternalJobs(formattedExternal);

    } catch (err) {
      console.log("Error loading jobs:", err);
    }

    setLoading(false);
  }

  return (
    <div className="p-5 sm:p-8">

      {/* Header */}
      <div className="flex justify-between mt-4 flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="text-2xl sm:text-3xl font-semibold text-white tracking-wide">
          Recommended Jobs
        </div>

        {jobType === "internal" && <Sort />}
      </div>

      {/* SWITCH BUTTONS */}
      <div className="flex gap-4 mt-6">
        <button
          className={`px-4 py-2 rounded-lg text-white ${
            jobType === "internal" ? "bg-bright-sun-400" : "bg-mine-shaft-700"
          }`}
          onClick={() => setJobType("internal")}
        >
          Internal Jobs
        </button>

        <button
          className={`px-4 py-2 rounded-lg text-white ${
            jobType === "external" ? "bg-bright-sun-400" : "bg-mine-shaft-700"
          }`}
          onClick={() => setJobType("external")}
        >
          External Jobs
        </button>
      </div>

      {/* JOB LIST */}
      <div className="
        mt-6 
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-2
        lg:grid-cols-3 
        xl:grid-cols-4 
        gap-6
      ">
        {loading ? (
          <div className="w-full h-[300px] flex justify-center items-center col-span-4">
            <Loader />
          </div>
        ) : jobType === "internal" ? (
          internalJobs.length > 0 ? (
            internalJobs.map((job, i) => (
              <div key={i} className="opacity-0 animate-fadeInUp" style={{ animationDelay: `${i * 70}ms` }}>
                <Jobcard data={job} />
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-4 text-center">No internal jobs found</p>
          )
        ) : (
          externalJobs.length > 0 ? (
            externalJobs.map((job, i) => (
              <div key={i} className="opacity-0 animate-fadeInUp" style={{ animationDelay: `${i * 70}ms` }}>
                <ExternalJobCard data={job} />
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-4 text-center">No external jobs found</p>
          )
        )}
      </div>

    </div>
  );
}

export default Jobs;
