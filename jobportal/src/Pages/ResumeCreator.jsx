import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ------------------------------------------------------------------
    CONFIG
--------------------------------------------------------------------*/
const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8080";
const COLLEGE_DATA_URL =
  "https://raw.githubusercontent.com/iamshubhamsingh/Indian-Colleges-API/main/colleges.json";

/* ------------------------------------------------------------------
    SAFE LOCAL STORAGE HELPERS
--------------------------------------------------------------------*/
const safeLocalGet = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const safeLocalSet = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

/* ==================================================================
    MAIN COMPONENT
====================================================================*/
export default function ResumeCreator() {
  /* FORM STATE */
  const [form, setForm] = useState(() =>
    safeLocalGet("resume_form_pro", {
      name: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
      summary: "",
      skills: "",
      experience: "",
      projects: "",
      education: "",
      achievements: "",
    })
  );

  const [template, setTemplate] = useState("modern");
  const [dark, setDark] = useState(true);

  /* AUTOCOMPLETE DATA */
  const jobTitles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Java Developer",
    "React Developer",
    "Spring Boot Developer",
    "Python Developer",
    "Data Analyst",
    "DevOps Engineer",
  ];

  const skillsList = [
    "Java",
    "Spring Boot",
    "React.js",
    "JavaScript",
    "Node.js",
    "HTML",
    "CSS",
    "Python",
    "SQL",
    "MongoDB",
    "DSA",
    "Git",
    "Docker",
    "AWS",
    "REST API",
    "Kubernetes",
  ];

  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionField, setActiveSuggestionField] = useState("");

  /* COLLEGE SEARCH STATES */
  const [collegeResults, setCollegeResults] = useState([]);
  const [isCollegeLoading, setIsCollegeLoading] = useState(false);
  const collegeTimerRef = useRef(null);

  /* AI LOADING per section */
  const [aiLoading, setAiLoading] = useState({});

  const previewRef = useRef(null);

  /* SAVE FORM ON CHANGE */
  useEffect(() => {
    safeLocalSet("resume_form_pro", form);
  }, [form]);

  /* HELPERS */
  const normalizeSkills = (s) =>
    String(s || "")
      .split(/[,\n]/)
      .map((x) => x.trim())
      .filter(Boolean);

  const setField = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  /* ------------------------------------------------------------------
        COLLEGE AUTOCOMPLETE (DEBOUNCED)
  --------------------------------------------------------------------*/
  const fetchColleges = (query) => {
    if (collegeTimerRef.current) clearTimeout(collegeTimerRef.current);

    collegeTimerRef.current = setTimeout(async () => {
      if (!query || query.length < 2) {
        setCollegeResults([]);
        return;
      }

      setIsCollegeLoading(true);
      try {
        const resp = await fetch(COLLEGE_DATA_URL);
        const data = await resp.json();

        const q = query.toLowerCase();
        const filtered = data
          .filter((c) => {
            const name = `${c.name || ""} ${c.city || ""} ${c.state || ""}`;
            return name.toLowerCase().includes(q);
          })
          .slice(0, 20);

        setCollegeResults(filtered);
      } catch {
        setCollegeResults([]);
      } finally {
        setIsCollegeLoading(false);
      }
    }, 300);
  };

  /* ------------------------------------------------------------------
        INPUT HANDLER
  --------------------------------------------------------------------*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);

    if (name === "education") {
      fetchColleges(value);
      setActiveSuggestionField("education");
    } else if (name === "jobTitle") {
      setSuggestions(jobTitles.filter((j) => j.toLowerCase().includes(value.toLowerCase())));
      setActiveSuggestionField("jobTitle");
    } else if (name === "skills") {
      setSuggestions(skillsList.filter((s) => s.toLowerCase().includes(value.toLowerCase())));
      setActiveSuggestionField("skills");
    } else {
      setSuggestions([]);
      setActiveSuggestionField("");
    }
  };

  /* APPLY SUGGESTION */
  const applySuggestion = (val, field) => {
    if (field === "skills") {
      const arr = normalizeSkills(form.skills);
      if (!arr.includes(val)) arr.push(val);
      setField("skills", arr.join(", "));
    } else if (field === "education") {
      const formatted = `${val.name}${val.city ? ", " + val.city : ""}${val.state ? ", " + val.state : ""}`;
      setField("education", formatted);
      setCollegeResults([]);
    } else {
      setField(field, val);
    }
    setSuggestions([]);
  };

  const removeSkill = (sk) =>
    setField(
      "skills",
      normalizeSkills(form.skills)
        .filter((x) => x !== sk)
        .join(", ")
    );

  /* ------------------------------------------------------------------
        AI SECTION GENERATOR (per-section) - uses backend endpoint
        Expects backend route: POST /api/ai/resume/generate { prompt }
  --------------------------------------------------------------------*/
  const callAI = async (section) => {
    // avoid duplicate calls
    if (aiLoading[section]) return;

    setAiLoading((s) => ({ ...s, [section]: true }));

    // carefully crafted prompt for your GeminiAIService
    const prompt = `
Write ONLY the ${section} section of a resume.
Do NOT write a full resume.
STRICT RULES:
- If section = skills → return comma-separated unique skills only (no word "AI" unless it's a real skill).
- If section = summary → return 3 strong ATS bullet points.
- If section = experience → return 3–5 concise bullet points.
- If section = projects → return 2–3 bullets.
- If section = achievements → return 2–3 bullets.
Keep the output clean and short.

Context:
Job Title: ${form.jobTitle}
Skills: ${form.skills}
Experience: ${form.experience}
Education: ${form.education}
Projects: ${form.projects}
Achievements: ${form.achievements}
`;

    try {
      const resp = await fetch(`${BACKEND_BASE}/api/ai/resume/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!resp.ok) throw new Error(`AI request failed ${resp.status}`);

      let text = await resp.text();

      // sanitize common artifacts
      text = text.replace(/\*+/g, "").trim();

      if (section === "skills") {
        // turn into unique comma-separated skills and remove stray word "ai" or "AI" unless exact skill
        const parts = text
          .split(/[,\n|;]+/)
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p) => p.replace(/^[-\u2022\s]+/, ""));

        // remove tokens that are just 'ai' or 'AI' unless user explicitly listed AI as skill earlier
        const userHasAI = normalizeSkills(form.skills).some((s) => /\bai\b/i.test(s));
        const filtered = parts.filter((p) => {
          if (/^ai$/i.test(p) && !userHasAI) return false;
          return true;
        });

        // dedupe and keep order
        const unique = [...new Set(filtered.map((p) => p))];
        text = unique.join(", ");
      }

      // update field
      setField(section, text);
    } catch (err) {
      console.error("AI call failed:", err);
      alert("AI generation failed. Check console for details.");
    }

    setAiLoading((s) => ({ ...s, [section]: false }));
  };

  /* ------------------------------------------------------------------
        PDF EXPORT
  --------------------------------------------------------------------*/
  const exportPDF = async () => {
    const el = previewRef.current;
    if (!el) return;

    try {
      // temporarily force white background for correct capture
      const originalBg = el.style.backgroundColor;
      el.style.backgroundColor = "#ffffff";

      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const img = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`${form.name || "resume"}.pdf`);

      el.style.backgroundColor = originalBg;
    } catch (err) {
      console.error("Export failed", err);
      alert("Export failed: " + (err.message || err));
    }
  };

  const skillChips = normalizeSkills(form.skills);

  /* =====================================================================
        UI SECTION
  =====================================================================*/
  return (
    <div className={`${dark ? "bg-[#0c0c0f] text-white" : "bg-gray-100 text-black"} min-h-screen p-4 md:p-6`}>
      {/* AI LOADER OVERLAY (global while any section loading) */}
      {Object.values(aiLoading).some(Boolean) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white/5 p-6 rounded-lg text-white text-lg flex items-center gap-3">
            <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.15" />
              <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
            Generating with AI…
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Resume Creator Pro (India-ready)</h1>
            <p className="text-sm text-gray-400 mt-1">AI sections, colleges autocomplete & smart templates</p>
          </div>

          <div className="flex gap-2 mt-2 md:mt-0">
            <button onClick={() => setDark((d) => !d)} className="px-3 py-2 bg-white/10 rounded">{dark ? "Light" : "Dark"}</button>
            <button
              onClick={() => {
                safeLocalSet("resume_form_pro", null);
                setForm({
                  name: "",
                  jobTitle: "",
                  email: "",
                  phone: "",
                  location: "",
                  linkedin: "",
                  portfolio: "",
                  summary: "",
                  skills: "",
                  experience: "",
                  projects: "",
                  education: "",
                  achievements: "",
                });
              }}
              className="px-3 py-2 bg-red-500 rounded"
            >
              Clear
            </button>
            <button onClick={exportPDF} className="px-3 py-2 bg-green-500 rounded text-black">Download PDF</button>
          </div>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT FORM */}
          <div className="max-h-[80vh] overflow-y-auto space-y-4 p-2">

            <div>
              <label className="text-sm">Full name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full bg-white/10 p-2 rounded mt-1" />
            </div>

            <div>
              <label className="text-sm">Job title</label>
              <input name="jobTitle" value={form.jobTitle} onChange={handleChange} className="w-full bg-white/10 p-2 rounded mt-1" />

              {activeSuggestionField === "jobTitle" && suggestions.length > 0 && (
                <div className="bg-white text-black rounded shadow mt-1">
                  {suggestions.map((s, i) => (
                    <div key={i} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => applySuggestion(s, "jobTitle")}>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Email</label>
                <input name="email" value={form.email} onChange={handleChange} className="w-full bg-white/10 p-2 rounded mt-1" />
              </div>

              <div>
                <label className="text-sm">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full bg-white/10 p-2 rounded mt-1" />
              </div>
            </div>

            <div>
              <label className="text-sm">Location</label>
              <input name="location" value={form.location} onChange={handleChange} className="w-full bg-white/10 p-2 rounded mt-1" />
            </div>

            <div>
              <label className="text-sm">Education (search college)</label>
              <input name="education" value={form.education} onChange={handleChange} className="w-full bg-white/10 p-2 rounded mt-1" placeholder="Type college name" />

              {isCollegeLoading && <div className="text-gray-400 text-sm mt-1">Searching…</div>}

              {activeSuggestionField === "education" && collegeResults.length > 0 && (
                <div className="bg-white text-black rounded shadow mt-1 max-h-64 overflow-y-auto">
                  {collegeResults.map((c, i) => (
                    <div key={i} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => applySuggestion(c, "education")}>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-xs text-gray-600">{c.city || ""}{c.state ? ", " + c.state : ""}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm">Skills</label>

              <div className="flex flex-wrap gap-2 mt-2">
                {skillChips.map((s) => (
                  <div key={s} className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded">
                    <span>{s}</span>
                    <button aria-label={`remove ${s}`} onClick={() => removeSkill(s)}>✕</button>
                  </div>
                ))}
              </div>

              <input name="skills" value={form.skills} onChange={handleChange} className="w-full p-2 bg-white/10 rounded mt-2" placeholder="Comma separated (e.g., Java, React)" />

              {activeSuggestionField === "skills" && suggestions.length > 0 && (
                <div className="bg-white text-black rounded shadow mt-1">
                  {suggestions.map((s, i) => (
                    <div key={i} className="p-2 hover:bg-gray-200 cursor-pointer" onClick={() => applySuggestion(s, "skills")}>
                      {s}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-2 flex gap-2">
                <button onClick={() => callAI("skills")} disabled={aiLoading["skills"]} className="px-3 py-2 bg-blue-600 rounded">
                  {aiLoading["skills"] ? "Generating…" : "AI Skills"}
                </button>
                <button onClick={() => setField("skills", "")} className="px-3 py-2 border rounded">Clear</button>
              </div>
            </div>

            {/* SUMMARY */}
            <div>
              <label className="text-sm">Summary</label>
              <div className="flex gap-2 mt-1">
                <textarea name="summary" value={form.summary} onChange={handleChange} className="w-full bg-white/10 p-2 rounded h-24" />
                <button onClick={() => callAI("summary")} disabled={aiLoading["summary"]} className="px-3 py-2 bg-indigo-600 rounded">
                  {aiLoading["summary"] ? "Generating…" : "AI"}
                </button>
              </div>
            </div>

            {/* EXPERIENCE */}
            <div>
              <label className="text-sm">Experience</label>
              <div className="flex gap-2 mt-1">
                <textarea name="experience" value={form.experience} onChange={handleChange} className="w-full bg-white/10 p-2 rounded h-28" />
                <button onClick={() => callAI("experience")} disabled={aiLoading["experience"]} className="px-3 py-2 bg-purple-600 rounded">
                  {aiLoading["experience"] ? "Generating…" : "AI"}
                </button>
              </div>
            </div>

            {/* PROJECTS */}
            <div>
              <label className="text-sm">Projects</label>
              <div className="flex gap-2 mt-1">
                <textarea name="projects" value={form.projects} onChange={handleChange} className="w-full bg-white/10 p-2 rounded h-28" />
                <button onClick={() => callAI("projects")} disabled={aiLoading["projects"]} className="px-3 py-2 bg-teal-600 rounded">
                  {aiLoading["projects"] ? "Generating…" : "AI"}
                </button>
              </div>
            </div>

            {/* ACHIEVEMENTS */}
            <div>
              <label className="text-sm">Achievements</label>
              <div className="flex gap-2 mt-1">
                <textarea name="achievements" value={form.achievements} onChange={handleChange} className="w-full bg-white/10 p-2 rounded h-20" />
                <button onClick={() => callAI("achievements")} disabled={aiLoading["achievements"]} className="px-3 py-2 bg-yellow-500 text-black rounded">
                  {aiLoading["achievements"] ? "Generating…" : "AI"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT PREVIEW */}
          <div className="md:col-span-2 bg-white text-black p-5 rounded shadow max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between mb-4 items-center">
              <div>
                <h2 className="text-xl font-semibold">Preview</h2>
                <p className="text-gray-500 text-sm">Template: {template}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setTemplate("modern")} className={`px-3 py-1 rounded ${template === "modern" ? "bg-gray-300" : "bg-gray-100"}`}>Modern</button>
                <button onClick={() => setTemplate("classic")} className={`px-3 py-1 rounded ${template === "classic" ? "bg-gray-300" : "bg-gray-100"}`}>Classic</button>
                <button onClick={() => setTemplate("creative")} className={`px-3 py-1 rounded ${template === "creative" ? "bg-gray-300" : "bg-gray-100"}`}>Creative</button>
              </div>
            </div>

            {/* ACTUAL PAGE */}
            <div ref={previewRef} className="p-6 border rounded bg-white min-h-[700px]">

              {/* MODERN TEMPLATE */}
              {template === "modern" && (
                <div className="max-w-3xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h1 className="text-3xl font-bold">{form.name || "Your Name"}</h1>
                      <div className="text-gray-700">{form.jobTitle}</div>
                    </div>
                    <div className="text-right text-sm text-gray-700">
                      <div>{form.email}</div>
                      <div>{form.phone}</div>
                      <div>{form.location}</div>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <h3 className="font-semibold">Summary</h3>
                  <p className="whitespace-pre-wrap">{form.summary}</p>

                  <h3 className="font-semibold mt-4">Skills</h3>
                  <div className="flex gap-2 flex-wrap mt-2">
                    {skillChips.map((s) => (
                      <span className="px-2 py-1 bg-gray-200 rounded text-xs" key={s}>{s}</span>
                    ))}
                  </div>

                  <h3 className="font-semibold mt-4">Experience</h3>
                  <p className="whitespace-pre-wrap">{form.experience}</p>

                  <h3 className="font-semibold mt-4">Projects</h3>
                  <p className="whitespace-pre-wrap">{form.projects}</p>

                  <h3 className="font-semibold mt-4">Education</h3>
                  <p>{form.education}</p>

                  <h3 className="font-semibold mt-4">Achievements</h3>
                  <p>{form.achievements}</p>
                </div>
              )}

              {/* CLASSIC TEMPLATE */}
              {template === "classic" && (
                <div className="max-w-3xl mx-auto text-center">
                  <h1 className="text-4xl font-bold">{form.name}</h1>
                  <div className="text-gray-600">{form.jobTitle}</div>
                  <div className="text-gray-600">{form.email} • {form.phone} • {form.location}</div>

                  <hr className="my-4" />

                  <h3 className="font-semibold">Summary</h3>
                  <p className="whitespace-pre-wrap">{form.summary}</p>

                  <h3 className="font-semibold mt-4">Skills</h3>
                  <p>{skillChips.join(", ")}</p>

                  <h3 className="font-semibold mt-4">Experience</h3>
                  <p className="whitespace-pre-wrap">{form.experience}</p>

                  <h3 className="font-semibold mt-4">Projects</h3>
                  <p className="whitespace-pre-wrap">{form.projects}</p>

                  <h3 className="font-semibold mt-4">Education</h3>
                  <p>{form.education}</p>

                  <h3 className="font-semibold mt-4">Achievements</h3>
                  <p>{form.achievements}</p>
                </div>
              )}

              {/* CREATIVE TEMPLATE */}
              {template === "creative" && (
                <div className="max-w-3xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h1 className="text-4xl font-bold">{form.name}</h1>
                      <div className="text-gray-600">{form.jobTitle}</div>
                    </div>
                    <div className="text-right text-sm text-gray-700">
                      <div>{form.email}</div>
                      <div>{form.phone}</div>
                      <div>{form.location}</div>
                    </div>
                  </div>

                  <section className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Summary</h3>
                    <p className="whitespace-pre-wrap">{form.summary}</p>
                  </section>

                  <section className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Skills</h3>
                    <div className="flex gap-2 flex-wrap">
                      {skillChips.map((s) => (
                        <span key={s} className="px-2 py-1 bg-gray-200 rounded text-sm">{s}</span>
                      ))}
                    </div>
                  </section>

                  <section className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Experience</h3>
                    <p className="whitespace-pre-wrap">{form.experience}</p>
                  </section>

                  <section className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Projects</h3>
                    <p className="whitespace-pre-wrap">{form.projects}</p>
                  </section>

                  <section className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Education</h3>
                    <p>{form.education}</p>
                  </section>

                  <section className="mt-6">
                    <h3 className="text-xl font-semibold mb-2">Achievements</h3>
                    <p>{form.achievements}</p>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
