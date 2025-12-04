import React, { useState } from "react";
import axios from "axios";

export default function AdminUploadJob() {
  const [job, setJob] = useState({
    company: "",
    jobTitle: "",
    description: "",
    experience: "",
    jobType: "",
    location: "",
    packageAmount: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:8080/jobportal/jobs/admin/upload",
        job,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("Job uploaded successfully!");

      // Reset form
      setJob({
        company: "",
        jobTitle: "",
        description: "",
        experience: "",
        jobType: "",
        location: "",
        packageAmount: "",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      showToast("Failed to upload job!", "error");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-mine-shaft-950 flex justify-center items-start py-16 px-4 sm:px-0">

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-8 right-8 px-6 py-3 rounded-xl shadow-lg text-black font-semibold 
          ${toast.type === "success" ? "bg-bright-sun-300" : "bg-red-400"} 
          animate-[slideIn_0.3s_ease-out] z-50`}
        >
          {toast.msg}
        </div>
      )}

      <div className="w-full max-w-2xl bg-mine-shaft-900 p-10 rounded-2xl shadow-xl border border-mine-shaft-800 animate-[fadeIn_0.5s_ease-out]">
        
        <h1 className="text-3xl font-bold text-bright-sun-300 text-center mb-10">
          Upload a New Job Posting
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Input Component */}
          {[
            {
              label: "Company Name",
              key: "company",
              placeholder: "Apple, Meta, Netflix...",
            },
            {
              label: "Job Title",
              key: "jobTitle",
              placeholder: "iOS Developer, Product Designer...",
            },
            {
              label: "Location",
              key: "location",
              placeholder: "Bangalore, Remote, London...",
            },
            {
              label: "Salary / Package",
              key: "packageAmount",
              placeholder: "₹12–18 LPA, $120k/year...",
            },
          ].map((field, i) => (
            <div key={i}>
              <label className="text-sm text-gray-300">{field.label}</label>
              <input
                value={job[field.key]}
                onChange={(e) => setJob({ ...job, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                required
                className="mt-1 w-full p-3 rounded-lg bg-mine-shaft-800 border border-mine-shaft-700
                focus:ring-2 focus:ring-bright-sun-400 outline-none transition-all duration-200"
              />
            </div>
          ))}

          {/* Experience + Job Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div>
              <label className="text-sm text-gray-300">Experience Level</label>
              <select
                value={job.experience}
                onChange={(e) =>
                  setJob({ ...job, experience: e.target.value })
                }
                required
                className="mt-1 w-full p-3 rounded-lg bg-mine-shaft-800 border border-mine-shaft-700
                focus:ring-2 focus:ring-bright-sun-400 outline-none"
              >
                <option value="">Select</option>
                <option>Entry Level</option>
                <option>Intermediate</option>
                <option>Expert</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300">Job Type</label>
              <select
                value={job.jobType}
                onChange={(e) =>
                  setJob({ ...job, jobType: e.target.value })
                }
                required
                className="mt-1 w-full p-3 rounded-lg bg-mine-shaft-800 border border-mine-shaft-700
                focus:ring-2 focus:ring-bright-sun-400 outline-none"
              >
                <option value="">Select</option>
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>

          </div>

          {/* Job Description */}
          <div>
            <label className="text-sm text-gray-300">Job Description</label>
            <textarea
              rows="5"
              value={job.description}
              onChange={(e) =>
                setJob({ ...job, description: e.target.value })
              }
              placeholder="Describe role, responsibilities, required skills, etc."
              required
              className="mt-1 w-full p-3 rounded-lg bg-mine-shaft-800 border border-mine-shaft-700
              focus:ring-2 focus:ring-bright-sun-400 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-bright-sun-300 text-black font-bold rounded-lg
            transform hover:scale-[1.02] active:scale-[0.97]
            transition-all duration-200 shadow-xl"
          >
            {loading ? "Uploading..." : "Upload Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
