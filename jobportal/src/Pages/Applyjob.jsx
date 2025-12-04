import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { filterByJobId, saveApplication } from "../api/JobApi";
import Loader from "../Findjobs/Loader";
import { useSelector } from "react-redux";

function Applyjob() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth); // Auto-fill user

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    resumeLink: "",
  });

  const [errors, setErrors] = useState({});

  /* =================================
       FETCH JOB
  ================================= */
  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const response = await filterByJobId(id);
        setJob(response.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchJob();
  }, [id]);

  /* =================================
       AUTO-FILL USER DETAILS
  ================================= */
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  /* =================================
        INPUT HANDLER
  ================================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =================================
       FORM VALIDATION
  ================================= */
  const validateForm = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";

    // Resume validation
    if (!form.resumeLink.trim()) {
      newErrors.resumeLink = "Resume / Portfolio link is required";
    } else if (!form.resumeLink.startsWith("http")) {
      newErrors.resumeLink = "Enter a valid URL (Google Drive / Portfolio)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =================================
        SAVE APPLICATION
  ================================= */
  const handleApply = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (alreadyApplied) {
      alert("You have already applied for this job.");
      return;
    }

    const payload = {
      jobId: job.id,
      jobTitle: job.jobTitle,
      company: job.company,
      jobType: job.jobType,
      location: job.location,
      packageAmount: job.packageAmount,
      experience: job.experience,
      name: form.name,
      email: form.email,
      phone: form.phone,
      resumeLink: form.resumeLink,
    };

    try {
      await saveApplication(payload);

      setAlreadyApplied(true);
      setShowToast(true);

      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      alert("Failed to submit application");
    }
  };

  /* =================================
        LOADING UI
  ================================= */
  if (loading || !job) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-mine-shaft-950">
        <Loader />
      </div>
    );
  }

  /* =================================
        MAIN UI
  ================================= */
  return (
    <div className="min-h-screen bg-mine-shaft-950 text-white py-10 px-4 sm:px-6 md:px-10 lg:px-16 font-poppins">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* JOB DETAILS */}
        <div className="lg:col-span-2 bg-mine-shaft-900 rounded-xl p-6 sm:p-8 border border-mine-shaft-800 shadow-xl">

          <h1 className="text-3xl sm:text-4xl font-bold">{job.jobTitle}</h1>
          <p className="text-mine-shaft-400 mt-2 text-lg">{job.company}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Tag>{job.jobType}</Tag>
            <Tag>📍 {job.location}</Tag>
            <Tag>⏱ {job.postedDaysAgo} days ago</Tag>
          </div>

          {/* Quick Info Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <InfoCard label="Salary" value={job.packageAmount} />
            <InfoCard label="Experience" value={job.experience} />
            <InfoCard label="Applicants" value={job.applicants} />
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-3">Job Description</h2>
            <p className="text-mine-shaft-300 leading-relaxed">{job.description}</p>
          </div>
        </div>

        {/* APPLY FORM */}
        <div className="bg-mine-shaft-900 rounded-xl p-6 border border-mine-shaft-800 shadow-xl h-fit sticky top-5">

          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-bright-sun-300">
            Apply For This Job
          </h2>

          <form onSubmit={handleApply} className="space-y-5">

            <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
            <InputField label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email} />
            <InputField label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
            <InputField label="Resume / Portfolio Link" name="resumeLink" value={form.resumeLink} onChange={handleChange} error={errors.resumeLink} />

            <button
              type="submit"
              disabled={alreadyApplied}
              className={`w-full py-3 rounded-lg font-semibold transition 
              ${alreadyApplied ? "bg-gray-600 cursor-not-allowed" : "bg-bright-sun-300 text-black hover:bg-bright-sun-200"}`}
            >
              {alreadyApplied ? "Already Applied" : "Submit Application"}
            </button>
          </form>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-8 right-5 bg-bright-sun-300 text-black px-5 py-3 rounded-xl shadow-xl z-50 font-semibold animate-[slide-left_0.3s_ease]">
          Application Submitted ✔
        </div>
      )}
    </div>
  );
}

/* COMPONENTS */

const Tag = ({ children }) => (
  <span className="px-3 py-1 bg-mine-shaft-800 rounded-full text-sm">{children}</span>
);

const InfoCard = ({ label, value }) => (
  <div className="p-4 bg-mine-shaft-850 rounded-xl border border-mine-shaft-700">
    <p className="text-xs text-mine-shaft-400">{label}</p>
    <p className="text-xl font-semibold mt-1">{value}</p>
  </div>
);

const InputField = ({ label, name, type = "text", value, onChange, error }) => (
  <div>
    <label className="block text-sm text-mine-shaft-300 mb-1">{label} *</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-3 rounded-lg bg-mine-shaft-800 border ${
        error ? "border-red-500" : "border-mine-shaft-700"
      }`}
      placeholder={`Enter your ${label.toLowerCase()}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default Applyjob;
