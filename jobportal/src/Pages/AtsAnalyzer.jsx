import React, { useState } from "react";
import { IconCheck, IconAlertTriangle } from "@tabler/icons-react";

function AtsAnalyzer() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [score, setScore] = useState(null);
  const [missingSkills, setMissingSkills] = useState([]);
  const [matchedSkills, setMatchedSkills] = useState([]);

  // Skills to detect (expand anytime)
  const skillList = [
    "Java", "Python", "React", "Node", "SQL", "MongoDB",
    "Spring Boot", "AWS", "Communication", "Leadership",
    "HTML", "CSS", "JavaScript", "Problem Solving"
  ];

  const analyzeATS = () => {
    if (!resume || !jd) {
      alert("Please paste both resume text and job description!");
      return;
    }

    const resumeLower = resume.toLowerCase();
    const jdLower = jd.toLowerCase();

    // MATCHED SKILLS
    const matched = skillList.filter(skill =>
      resumeLower.includes(skill.toLowerCase()) &&
      jdLower.includes(skill.toLowerCase())
    );

    // MISSING SKILLS
    const missing = skillList.filter(skill =>
      jdLower.includes(skill.toLowerCase()) &&
      !resumeLower.includes(skill.toLowerCase())
    );

    setMatchedSkills(matched);
    setMissingSkills(missing);

    // ATS SCORE (Smart logic)
    const skillScore = (matched.length / (matched.length + missing.length)) * 100;
    const baseScore = 60 + Math.random() * 20; // Add realism

    const finalScore = Math.min(99, Math.floor((skillScore * 0.7) + baseScore));
    setScore(finalScore);
  };

  return (
    <div className="text-white p-6 sm:p-10 max-w-5xl mx-auto">

      {/* TITLE */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">ATS Score Analyzer</h1>

      {/* TEXT INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Resume Box */}
        <textarea
          className="w-full h-52 p-4 bg-black/40 rounded-xl border border-white/20 outline-none"
          placeholder="Paste your Resume text here..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />

        {/* Job Description Box */}
        <textarea
          className="w-full h-52 p-4 bg-black/40 rounded-xl border border-white/20 outline-none"
          placeholder="Paste Job Description here..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />

      </div>

      {/* ANALYZE BUTTON */}
      <button
        onClick={analyzeATS}
        className="
          px-8 py-3 bg-yellow-400 text-black font-bold 
          rounded-xl hover:bg-yellow-300 transition
        "
      >
        Analyze ATS Score
      </button>

      {/* RESULTS */}
      {score !== null && (
        <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/20 backdrop-blur-lg">

          {/* SCORE */}
          <h2 className="text-2xl font-bold mb-3">ATS Score</h2>
          <p
            className={`
              text-5xl font-extrabold 
              ${score >= 85 ? "text-green-400" : "text-yellow-400"}
            `}
          >
            {score}%
          </p>

          <p className="text-gray-300 mt-1">
            {score >= 85
              ? "Great! Your resume is highly compatible with this job."
              : "Needs improvement. Add missing skills to boost your score."}
          </p>

          {/* MATCHED SKILLS */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-green-400 mb-2 flex items-center gap-2">
              <IconCheck size={22} /> Matched Skills ({matchedSkills.length})
            </h3>

            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-green-600/30 border border-green-400 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}

              {matchedSkills.length === 0 && (
                <p className="text-gray-400">No relevant skills matched.</p>
              )}
            </div>
          </div>

          {/* MISSING SKILLS */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-red-400 mb-2 flex items-center gap-2">
              <IconAlertTriangle size={22} /> Missing Skills ({missingSkills.length})
            </h3>

            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-red-600/30 border border-red-400 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}

              {missingSkills.length === 0 && (
                <p className="text-gray-400">No missing skills 🎉</p>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default AtsAnalyzer;
