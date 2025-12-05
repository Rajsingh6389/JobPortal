// src/Templates/TemplateThree.jsx
import React from "react";

function TemplateThree({ data }) {
  // safe getters
  const safe = (k) => (data && data[k] ? data[k] : "");

  return (
    <div
      style={{ width: "794px" }} // A4-ish width for preview/export
      className="bg-white text-black p-10 leading-relaxed font-sans"
    >
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{safe("name")}</h1>
        <p className="text-lg font-semibold text-gray-700">{safe("jobTitle")}</p>
        <p className="mt-2 text-gray-800">
          {safe("location")} {safe("phone") ? `| ${safe("phone")}` : ""}{" "}
          {safe("email") ? `| ${safe("email")}` : ""}
        </p>
        {safe("linkedin") && <p className="text-gray-800">LinkedIn: {safe("linkedin")}</p>}
        {safe("portfolio") && <p className="text-gray-800">Portfolio: {safe("portfolio")}</p>}
      </div>

      <hr className="my-4 border-gray-400" />

      {/* SUMMARY */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-1">Professional Summary</h2>
        <p className="text-[15px]">{safe("summary")}</p>
      </section>

      {/* SKILLS */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-1">Skills</h2>
        <ul className="list-disc ml-6 text-[15px]">
          {safe("skills")
            .split(",")
            .map((s, i) => (s.trim() ? <li key={i}>{s.trim()}</li> : null))}
        </ul>
      </section>

      {/* EXPERIENCE */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-1">Experience</h2>
        <div className="whitespace-pre-wrap text-[15px]">{safe("experience")}</div>
      </section>

      {/* PROJECTS */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-1">Projects</h2>
        <div className="whitespace-pre-wrap text-[15px]">{safe("projects")}</div>
      </section>

      {/* EDUCATION */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-1">Education</h2>
        <div className="whitespace-pre-wrap text-[15px]">{safe("education")}</div>
      </section>

      {/* ACHIEVEMENTS */}
      {safe("achievements") && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-1">Achievements</h2>
          <div className="whitespace-pre-wrap text-[15px]">{safe("achievements")}</div>
        </section>
      )}

      {/* ATS keywords */}
      {safe("ats") && (
        <section>
          <h2 className="text-xl font-bold mb-1">ATS Keywords</h2>
          <div className="whitespace-pre-wrap text-[15px]">{safe("ats")}</div>
        </section>
      )}
    </div>
  );
}

export default TemplateThree;
