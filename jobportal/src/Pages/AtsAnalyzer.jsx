import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8080";

export default function ATSAnalyzer() {
  const [resumeText, setResumeText] = useState("");

  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingOCR, setLoadingOCR] = useState(false);

  const [score, setScore] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [strengths, setStrengths] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4500);
    return () => clearTimeout(t);
  }, [notice]);


  // ===========================================
  // Full Screen Loader Component
  // ===========================================
  const Loader = ({ text }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
      <div className="bg-white/10 p-8 rounded-2xl border border-white/20 text-center shadow-xl">
        <div className="loader-spin mx-auto mb-4"></div>
        <p className="text-white text-lg font-semibold">{text}</p>
      </div>
    </div>
  );


  // ===========================================
  // Handle PDF Upload
  // ===========================================
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".pdf")) {
      setNotice({ type: "error", message: "Please upload a PDF file only!" });
      return;
    }

    extractPDF(file);
  };

  // ===========================================
  // Extract Normal PDF → Then OCR if needed
  // ===========================================
  const extractPDF = async (file) => {
    setLoadingPDF(true);
    setResumeText("");
    setScore(null);

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((t) => t.str).join(" ") + "\n";
        }

        // If PDF has no selectable text → OCR mode
        if (text.trim().length < 15) {
          setNotice({ type: "warning", message: "Scanned PDF detected → Running OCR…" });

          text = await runOCR(pdf);
        }

        if (text.trim().length < 10) {
          setNotice({ type: "error", message: "Could not extract text from PDF." });
          setLoadingPDF(false);
          return;
        }

        setResumeText(text);
        setNotice({ type: "success", message: "PDF processed successfully!" });
      } catch (err) {
        setNotice({ type: "error", message: "Failed to read PDF." });
      }

      setLoadingPDF(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // ===========================================
  // OCR (Scanned PDF)
  // ===========================================
  const runOCR = async (pdf) => {
    setLoadingOCR(true);

    let finalText = "";
    try {
      for (let i = 1; i <= Math.min(pdf.numPages, 3); i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: ctx, viewport }).promise;

        const res = await Tesseract.recognize(canvas, "eng");
        finalText += res.data.text + "\n";
      }
    } catch (err) {
      console.error("OCR error:", err);
    }

    setLoadingOCR(false);
    return finalText;
  };


  // ===========================================
  // Fallback ATS Logic
  // ===========================================
  const fallbackATS = (text) => {
    const skills = [
      "Java", "Python", "JavaScript", "React", "Node.js", "SQL",
      "AWS", "Docker", "Kubernetes", "Machine Learning",
      "Data Analysis", "Git", "CI/CD", "REST APIs"
    ];

    const lower = text.toLowerCase();

    const matched = skills.filter((s) => lower.includes(s.toLowerCase()));
    const missing = skills.filter((s) => !lower.includes(s.toLowerCase()));

    const score = Math.min(95, Math.max(25, matched.length * 6));

    return {
      score,
      matchedSkills: matched,
      missingSkills: missing,
      strengths: "Strong skill foundation. Consider adding quantifiable achievements.",
      suggestions: "Add missing skills, measurable success metrics, and clearer role impact."
    };
  };


  // ===========================================
  // Analyze with AI (Gemini)
  // ===========================================
  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setNotice({ type: "error", message: "Upload a resume first!" });
      return;
    }

    setLoadingAI(true);

    const prompt = `
Analyze this resume and return ONLY JSON:

{
  "score": number,
  "matchedSkills": ["skill1"],
  "missingSkills": ["skill2"],
  "strengths": "text",
  "suggestions": "text"
}

Resume:
${resumeText}
`;

    try {
      const response = await fetch(`${BACKEND_BASE}/api/ai/resume/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const raw = await response.text();

      const jsonMatch = raw.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        applyFallback("AI returned invalid JSON.");
        return;
      }

      const data = JSON.parse(jsonMatch[0]);

      setScore(data.score);
      setMatchedSkills(data.matchedSkills);
      setMissingSkills(data.missingSkills);
      setStrengths(data.strengths);
      setSuggestions(data.suggestions);

      setNotice({ type: "success", message: "AI Analysis Complete!" });
    } catch (err) {
      applyFallback("AI failed. Using fallback ATS.");
    }

    setLoadingAI(false);
  };

  const applyFallback = (msg) => {
    const fb = fallbackATS(resumeText);
    setScore(fb.score);
    setMatchedSkills(fb.matchedSkills);
    setMissingSkills(fb.missingSkills);
    setStrengths(fb.strengths);
    setSuggestions(fb.suggestions);
    setNotice({ type: "warning", message: msg });
    setLoadingAI(false);
  };


  // ===========================================
  // UI Rendering
  // ===========================================
  return (
    <div className="p-6 max-w-5xl mx-auto text-white">

      {(loadingAI || loadingPDF || loadingOCR) && (
        <Loader
          text={
            loadingPDF
              ? "Extracting PDF…"
              : loadingOCR
                ? "Running OCR on scanned PDF…"
                : "Analyzing with AI…"
          }
        />
      )}

      {notice && (
        <div className={`p-4 mb-4 rounded-xl text-sm font-semibold animate-fadeIn ${
          notice.type === "error" ? "bg-red-500/20 text-red-300 border border-red-400/20" :
          notice.type === "warning" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/20" :
          "bg-green-500/20 text-green-300 border border-green-400/20"
        }`}>
          {notice.message}
        </div>
      )}

      <h1 className="text-4xl font-extrabold mb-6 text-yellow-300">
        AI-Powered ATS Resume Analyzer ⚡
      </h1>

      {/* Upload Box */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg mb-6">
        <p className="text-lg mb-3">Upload Resume (PDF, Normal or Scanned)</p>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="p-3 bg-gray-900 rounded w-full cursor-pointer"
        />
      </div>

      {/* Analyze Button */}
      <button
        onClick={analyzeResume}
        className="px-10 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition w-full sm:w-auto shadow-lg"
      >
        Analyze Resume
      </button>

      {/* Results */}
      {score !== null && (
        <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-lg">

          <h2 className="text-3xl font-bold">ATS Score</h2>
          <p className={`text-6xl font-extrabold mt-2 ${
            score >= 80 ? "text-green-400" : "text-yellow-300"
          }`}>
            {score}%
          </p>

          {/* Strengths */}
          <section className="mt-6">
            <h3 className="text-xl font-semibold text-green-400">Strengths</h3>
            <p className="text-gray-300 mt-1 whitespace-pre-wrap">{strengths}</p>
          </section>

          {/* Matched Skills */}
          <section className="mt-6">
            <h3 className="text-xl font-semibold text-green-300">
              Matched Skills ({matchedSkills.length})
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {matchedSkills.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-green-600/30 border border-green-400 rounded-full text-sm">{s}</span>
              ))}
            </div>
          </section>

          {/* Missing Skills */}
          <section className="mt-6">
            <h3 className="text-xl font-semibold text-red-400">
              Missing Skills ({missingSkills.length})
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {missingSkills.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-red-600/30 border border-red-400 rounded-full text-sm">{s}</span>
              ))}
            </div>
          </section>

          {/* Suggestions */}
          <section className="mt-6">
            <h3 className="text-xl font-semibold text-yellow-300">AI Suggestions</h3>
            <p className="text-gray-300 mt-1 whitespace-pre-wrap">{suggestions}</p>
          </section>
        </div>
      )}

      {/* ===============================================
           EXTRA FEATURES SECTION (BONUS)
      =============================================== */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">

        {/* Weather Feature */}
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg">
          <h3 className="text-xl font-bold text-blue-300">🌤 Today's Weather</h3>
          <p className="mt-2 text-gray-300">Stay updated. Refresh your mind for job hunting!</p>
        </div>

        {/* Tips Feature */}
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg">
          <h3 className="text-xl font-bold text-yellow-300">💡 Resume Tip</h3>
          <p className="mt-2 text-gray-300">Use action verbs like "Led", "Developed", "Designed" to boost impact.</p>
        </div>

        {/* Tools Feature */}
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 shadow-lg">
          <h3 className="text-xl font-bold text-green-300">🛠 Career Tools</h3>
          <p className="mt-2 text-gray-300">Explore salary insights, job trends, and skill heatmaps.</p>
        </div>

      </div>

    </div>
  );
}
