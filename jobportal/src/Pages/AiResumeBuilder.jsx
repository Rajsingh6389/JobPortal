import React, { useState } from "react";
import jsPDF from "jspdf";
import Comingsoon from "./Comingsoon";

function AiResumeBuilder() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!resume.trim()) return alert("Please paste your resume.");
    
    setLoading(true);

    // SIMPLE AI MOCK LOGIC (replace with real API later)
    const improved = `
${job ? "🔹 Tailored for Job: " + job.slice(0, 70) + "...\n\n" : ""}
PROFESSIONAL SUMMARY
• Highly motivated professional with strong problem-solving, communication,
  and teamwork skills.
• Experienced in modern tools, clean documentation, and optimized workflows.
• Proven ability to work independently and deliver high-quality results.

KEY SKILLS
• React • JavaScript • Communication • Leadership
• Fast Learning • Adaptability • Teamwork

EXPERIENCE IMPROVEMENTS
• Added ATS-friendly keywords.
• Optimized bullet formatting for clarity.
• Enhanced sentence structure.
• Improved grammar and readability.

ORIGINAL RESUME IMPROVED VERSION
${resume}
`;

    setOutput(improved);
    setLoading(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(output, 180);
    doc.text(lines, 10, 10);
    doc.save("Improved-Resume.pdf");
  };

  return (
    // <div className="text-white p-8 max-w-4xl mx-auto">

    //   <h1 className="text-3xl font-bold mb-6">AI Resume Builder</h1>

    //   {/* Resume Input */}
    //   <textarea
    //     className="w-full h-40 p-4 bg-black/40 rounded mb-4 border border-white/20"
    //     placeholder="Paste your resume here..."
    //     value={resume}
    //     onChange={(e) => setResume(e.target.value)}
    //   />

    //   {/* Job Description Input */}
    //   <textarea
    //     className="w-full h-28 p-4 bg-black/40 rounded mb-4 border border-white/20"
    //     placeholder="Paste job description (optional)..."
    //     value={job}
    //     onChange={(e) => setJob(e.target.value)}
    //   />

    //   {/* Generate Button */}
    //   <button
    //     onClick={generate}
    //     className="px-6 py-3 bg-yellow-400 text-black rounded font-bold hover:bg-yellow-300 transition"
    //   >
    //     {loading ? "Generating..." : "Generate Resume"}
    //   </button>

    //   {/* Output Section */}
    //   {output && (
    //     <div className="mt-8 bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/20">

    //       <h2 className="text-2xl font-semibold mb-4 text-yellow-400">AI-Improved Resume</h2>

    //       <pre className="whitespace-pre-wrap text-gray-200 leading-relaxed text-[15px]">
    //         {output}
    //       </pre>

    //       <button
    //         onClick={downloadPDF}
    //         className="mt-6 px-6 py-3 bg-green-400 text-black rounded font-bold hover:bg-green-300 transition"
    //       >
    //         Download as PDF
    //       </button>

    //     </div>
    //   )}
    // </div>
    <div>
      <Comingsoon />
    </div>
  );
}

export default AiResumeBuilder;
