import React, { useState, useEffect, useRef } from "react";
import Sort from "./Sort";
import { getAllJobs } from "../api/JobApi";
import Jobcard from "./Jobcard";
import Loader from "./Loader";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const allJobsRef = useRef([]);
  const [currentSort, setCurrentSort] = useState("Relevance");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    setLoading(true);

    try {
      const res = await getAllJobs();
      console.log("API raw data:", res.data);

      let list = [];

      if (Array.isArray(res.data)) list = res.data;
      else if (Array.isArray(res.data?.jobs)) list = res.data.jobs;
      else if (Array.isArray(res.data?.content)) list = res.data.content;
      else if (Array.isArray(res.data?.data)) list = res.data.data;

      console.log("Final Job List:", list);

      allJobsRef.current = list;
      setJobs(list);
    } catch (error) {
      console.log("Error:", error);
    }

    setTimeout(() => setLoading(false), 700);
  }

  function cleanSalary(value) {
    if (!value) return 0;
    return parseInt(value.replace(/\D/g, ""));
  }

  function handleSort(option) {
    setCurrentSort(option);

    let sorted = [...allJobsRef.current];

    if (option === "Most Recent") {
      sorted.sort((a, b) => (a.postedDaysAgo ?? 0) - (b.postedDaysAgo ?? 0));
    }

    if (option === "Salary (Low to High)") {
      sorted.sort(
        (a, b) => cleanSalary(a.packageAmount) - cleanSalary(b.packageAmount)
      );
    }

    if (option === "Salary (High to Low)") {
      sorted.sort(
        (a, b) => cleanSalary(b.packageAmount) - cleanSalary(a.packageAmount)
      );
    }

    if (option === "Relevance") {
      sorted = [...allJobsRef.current];
    }

    setJobs(sorted);
  }

  return (
    <div className="p-5 sm:p-8">

      {/* Header */}
      <div className="flex justify-between mt-4 flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="text-2xl sm:text-3xl font-semibold text-white tracking-wide">
          Recommended Jobs
        </div>
        <Sort onSortChange={handleSort} />
      </div>

      {/* JOB LIST */}
      <div
        className="
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
        ) : jobs.length > 0 ? (
          jobs.map((job, i) => (
            <div
              key={i}
              className="opacity-0 animate-fadeInUp"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <Jobcard data={job} />
            </div>
          ))
        ) : (
          <div className="col-span-4 flex flex-col items-center py-10 text-center">
            <img 
              src="/empty-state.png" 
              alt="No jobs" 
              className="h-32 opacity-70 mb-3"
            />
            <p className="text-gray-400 text-lg">No jobs found</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default Jobs;
