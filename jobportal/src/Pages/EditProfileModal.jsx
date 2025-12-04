import React, { useState } from "react";
import { updateProfileApi } from "../api/profileApi";

const roleOptions = [
  "Designer", "Developer", "Product Manager", "Marketing Specialist",
  "Data Analyst", "Sales Executive", "Content Writer", "Customer Support",
];

const locationOptions = [
  "Delhi", "New York", "San Francisco", "London",
  "Berlin", "Tokyo", "Sydney", "Toronto",
];

const skillsOptions = [
  "HTML", "CSS", "JavaScript", "React", "Angular",
  "Node.js", "Python", "Java", "Ruby", "PHP", "SQL",
  "MongoDB", "PostgreSQL", "Git", "API Development",
  "Testing", "Agile", "DevOps", "AWS", "Azure", "Google Cloud",
];

function EditProfileModal({ close, user, refresh }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user.name,
    about: user.about || "",
    role: user.role || "",
    location: user.location || "",
    expectedSalary: user.expectedSalary || "",
    skills: user.skills || "",
  });

  const selectedSkills = form.skills ? form.skills.split(",").map(s => s.trim()) : [];

  const toggleSkill = (skill) => {
    const updated = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill];

    setForm({ ...form, skills: updated.join(",") });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return alert("Name is required");
    if (!form.role.trim()) return alert("Please select a role");
    if (!form.location.trim()) return alert("Please select a location");

    try {
      setLoading(true);
      await updateProfileApi(form);
      refresh();
      close();
    } catch (error) {
      alert("Failed to update profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  /* CLOSE MODAL ON OUTSIDE CLICK */
  const closeOnBackground = (e) => {
    if (e.target.id === "modal-bg") close();
  };

  return (
    <div
      id="modal-bg"
      onClick={closeOnBackground}
      className="fixed inset-0 bg-black/60 flex justify-center items-center p-3 z-50"
    >
      <div
        className="
          bg-mine-shaft-900 border border-mine-shaft-700 rounded-xl 
          w-full max-w-[420px] sm:max-w-[450px]
          p-6 sm:p-7 shadow-2xl 
          max-h-[90vh] overflow-y-auto 
          animate-[scaleFade_0.25s_ease-out]
        "
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-bright-sun-300 mb-6 text-center">
          Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Field
            label="Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <TextareaField
            label="About"
            value={form.about}
            onChange={(v) => setForm({ ...form, about: v })}
          />

          <SelectField
            label="Role"
            value={form.role}
            onChange={(v) => setForm({ ...form, role: v })}
            options={roleOptions}
          />

          <SelectField
            label="Location"
            value={form.location}
            onChange={(v) => setForm({ ...form, location: v })}
            options={locationOptions}
          />

          <Field
            label="Expected Salary"
            placeholder="e.g. ₹5–10 LPA"
            value={form.expectedSalary}
            onChange={(v) => setForm({ ...form, expectedSalary: v })}
          />

          {/* SKILLS */}
          <div className="space-y-1">
            <label className="text-sm text-bright-sun-200">Skills</label>

            <div className="flex flex-wrap gap-2 mt-2">
              {skillsOptions.map((skill, i) => {
                const active = selectedSkills.includes(skill);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`
                      px-3 py-1 text-xs rounded-full transition-all border
                      ${
                        active
                          ? "bg-bright-sun-300 text-black border-bright-sun-300 shadow-lg scale-105"
                          : "bg-mine-shaft-800 border-mine-shaft-700 hover:bg-mine-shaft-700"
                      }
                    `}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={close}
              className="w-full py-2.5 rounded-lg bg-mine-shaft-700 hover:bg-mine-shaft-600 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-2.5 rounded-lg bg-bright-sun-300 
                text-black font-semibold hover:bg-bright-sun-200 
                transition disabled:bg-gray-500 disabled:text-gray-200
              "
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

/* ============================
    REUSABLE UI COMPONENTS
============================ */

const Field = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-1">
    <label className="text-sm text-bright-sun-200">{label}</label>
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full p-2.5 rounded-lg text-white
        bg-mine-shaft-850 border border-mine-shaft-700
        focus:border-bright-sun-300 outline-none transition
      "
    />
  </div>
);

const TextareaField = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-sm text-bright-sun-200">{label}</label>
    <textarea
      rows="3"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full p-2.5 rounded-lg text-white
        bg-mine-shaft-850 border border-mine-shaft-700
        focus:border-bright-sun-300 outline-none transition
      "
    />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div className="space-y-1">
    <label className="text-sm text-bright-sun-200">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full p-2.5 rounded-lg text-white
        bg-mine-shaft-850 border border-mine-shaft-700
        focus:border-bright-sun-300 outline-none transition
      "
    >
      <option value="">Select {label}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default EditProfileModal;
