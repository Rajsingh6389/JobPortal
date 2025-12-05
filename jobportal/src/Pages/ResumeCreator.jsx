import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ResumeCreator_Pro.jsx
// Single-file advanced resume creator (client-side React)
// - Live college autocomplete from a public GitHub dataset (no hardcoded colleges)
// - Debounced search, safe localStorage usage
// - AI section buttons that call your backend (section-by-section)
// - Multiple templates, live preview, PDF export (html2canvas/jspdf)
// - Tailwind CSS classes used for styling (optional)

// NOTES:
// - Replace BACKEND_BASE with your Spring Boot backend URL if different.
// - AI endpoints assumed (section-by-section):
//    POST ${BACKEND_BASE}/api/ai/summary  { prompt }
//    POST ${BACKEND_BASE}/api/ai/skills   { prompt }
//    POST ${BACKEND_BASE}/api/ai/experience { prompt }
//  They should return plain text in the response body.

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8080";
const COLLEGE_DATA_URL = "https://raw.githubusercontent.com/iamshubhamsingh/Indian-Colleges-API/main/colleges.json";

const safeLocalGet = (k, fallback) => {
  try {
    if (typeof window === "undefined") return fallback;
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
};

const safeLocalSet = (k, v) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {
    // ignore
  }
};

export default function ResumeCreatorPro() {
  const [form, setForm] = useState(() => {
    return (
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
  });

  const [template, setTemplate] = useState("modern");
  const [dark, setDark] = useState(true);

  // Suggestions (job titles, skills remain small local lists)
  const jobTitles = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Analyst",
    "Machine Learning Engineer",
    "DevOps Engineer",
  ];

  const skillsList = ["React.js", "JavaScript", "HTML/CSS", "Node.js", "Spring Boot", "Python", "SQL", "Docker", "AWS"];

  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionField, setActiveSuggestionField] = useState("");

  // College autocomplete results (fetched from remote dataset)
  const [collegeResults, setCollegeResults] = useState([]);
  const [isCollegeLoading, setIsCollegeLoading] = useState(false);
  const collegeTimerRef = useRef(null);

  // preview ref for html2canvas
  const previewRef = useRef(null);

  // Persist draft
  useEffect(() => {
    safeLocalSet("resume_form_pro", form);
  }, [form]);

  // -----------------------
  // Helpers
  // -----------------------
  const normalizeSkills = (s) => {
    if (!s) return [];
    if (Array.isArray(s)) return s.map((x) => String(x).trim()).filter(Boolean);
    return String(s)
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  };

  const setField = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  // -----------------------
  // College autocomplete (debounced, remote)
  // -----------------------
  const fetchColleges = async (query) => {
    // clear any previous timer
    if (collegeTimerRef.current) clearTimeout(collegeTimerRef.current);

    collegeTimerRef.current = setTimeout(async () => {
      if (!query || query.length < 2) {
        setCollegeResults([]);
        return;
      }

      setIsCollegeLoading(true);
      try {
        const resp = await fetch(COLLEGE_DATA_URL, { cache: "no-cache" });
        const data = await resp.json();
        if (!Array.isArray(data)) {
          setCollegeResults([]);
          setIsCollegeLoading(false);
          return;
        }

        const q = query.toLowerCase();
        const filtered = data
          .filter((c) => {
            const name = (c.name || c.institution || "") + " " + (c.city || "") + " " + (c.state || "");
            return name.toLowerCase().includes(q);
          })
          .slice(0, 12);

        setCollegeResults(filtered);
      } catch (err) {
        console.error("College fetch error", err);
        setCollegeResults([]);
      } finally {
        setIsCollegeLoading(false);
      }
    }, 300);
  };

  // -----------------------
  // Input handler
  // -----------------------
  const handleChange = (e) => {
    const { name, value } = e.target || {};
    if (!name) return;
    setField(name, value);

    if (name === "education") {
      // call remote college search
      fetchColleges(value);
      setActiveSuggestionField("education");
    } else if (name === "jobTitle") {
      const found = jobTitles.filter((t) => t.toLowerCase().includes(String(value || "").toLowerCase()));
      setSuggestions(found);
      setActiveSuggestionField("jobTitle");
    } else if (name === "skills") {
      const found = skillsList.filter((s) => s.toLowerCase().includes(String(value || "").toLowerCase()));
      setSuggestions(found);
      setActiveSuggestionField("skills");
    } else {
      setSuggestions([]);
      setActiveSuggestionField("");
    }
  };

  const applySuggestion = (text, field) => {
    if (field === "skills") {
      const parts = normalizeSkills(form.skills);
      if (!parts.includes(text)) parts.push(text);
      setField("skills", parts.join(", "));
    } else if (field === "education") {
      // if the result is an object from remote data, format it
      const value = typeof text === "object" && text !== null ? `${text.name}${text.city ? ", " + text.city : ""}${text.state ? ", " + text.state : ""}` : String(text);
      setField("education", value);
      setCollegeResults([]);
      setActiveSuggestionField("");
    } else {
      setField(field, text);
      setSuggestions([]);
      setActiveSuggestionField("");
    }
  };

  const removeSkill = (skill) => setField("skills", normalizeSkills(form.skills).filter((s) => s !== skill).join(", "));

  // -----------------------
  // AI Section calls (section-by-section)
  // backend endpoints expected to return plain text
  // -----------------------
  const callAI = async (section) => {
    // Build a simple prompt combining context; backend can rephrase/ignore
    const promptParts = [];
    if (form.jobTitle) promptParts.push(`Job title: ${form.jobTitle}`);
    if (form.skills) promptParts.push(`Skills: ${form.skills}`);
    if (form.experience) promptParts.push(`Experience: ${form.experience}`);
    if (form.education) promptParts.push(`Education: ${form.education}`);
    if (form.projects) promptParts.push(`Projects: ${form.projects}`);
    const prompt = promptParts.concat([`Please generate the ${section} section for a resume.`]).join("\n");

    try {
      const resp = await fetch(`${BACKEND_BASE}/api/ai/resume/${section}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!resp.ok) throw new Error(`AI response ${resp.status}`);
      const text = await resp.text();
      if (section === "summary") setField("summary", text);
      else if (section === "skills") setField("skills", text);
      else if (section === "experience") setField("experience", text);
      else if (section === "projects") setField("projects", text);
      else if (section === "education") setField("education", text);
      else if (section === "achievements") setField("achievements", text);
      return text;
    } catch (err) {
      console.error("AI call failed", err);
      alert("AI generation failed. Check backend or console.");
      return null;
    }
  };

  // convenience wrappers
  const generateSummary = () => callAI("summary");
  const generateSkills = () => callAI("skills");
  const generateExperience = () => callAI("experience");
  const generateProjects = () => callAI("projects");
  const generateEducation = () => callAI("education");
  const generateAchievements = () => callAI("achievements");

  // -----------------------
  // PDF export using html2canvas + jspdf (image-based)
  // -----------------------
  const exportPDF = async () => {
    const el = previewRef.current;
    if (!el) return alert("Preview not ready");

    try {
      // temporarily remove transforms to avoid clipping
      const originalTransform = el.style.transform;
      el.style.transform = "none";

      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`${form.name || "resume"}.pdf`);

      el.style.transform = originalTransform;
    } catch (err) {
      console.error("Export failed", err);
      alert("Export failed: " + (err.message || err));
    }
  };

  // -----------------------
  // Small UI helpers
  // -----------------------
  const skillChips = normalizeSkills(form.skills);

  return (
    <div className={`${dark ? "bg-[#0b0b0c] text-white" : "bg-gray-50 text-black"} min-h-screen p-6`}>
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Resume Creator Pro</h1>
            <p className="text-sm text-gray-400">Live college search, AI section generator, export & templates</p>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setDark((d) => !d)} className="px-3 py-2 bg-white/10 rounded">{dark ? "Light" : "Dark"}</button>
            <button onClick={() => { safeLocalSet("resume_form_pro", null); setForm({ name: "", jobTitle: "", email: "", phone: "", location: "", linkedin: "", portfolio: "", summary: "", skills: "", experience: "", projects: "", education: "", achievements: "" }); }} className="px-3 py-2 bg-red-500 text-black rounded">Clear</button>
            <button onClick={exportPDF} className="px-3 py-2 bg-green-500 text-black rounded">Download PDF</button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="md:col-span-1 bg-transparent p-4 rounded max-h-[72vh] overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="text-sm">Full name</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-white/5" />
              </div>

              <div>
                <label className="text-sm">Job title</label>
                <input name="jobTitle" value={form.jobTitle} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-white/5" />
                {suggestions.length > 0 && activeSuggestionField === "jobTitle" && (
                  <div className="mt-1 bg-white text-black rounded shadow divide-y">
                    {suggestions.map((s, i) => <div key={i} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => applySuggestion(s, "jobTitle")}>{s}</div>)}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm">Email</label>
                  <input name="email" value={form.email} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-white/5" />
                </div>
                <div>
                  <label className="text-sm">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-white/5" />
                </div>
              </div>

              <div>
                <label className="text-sm">Education (search colleges)</label>
                <input name="education" value={form.education} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-white/5" placeholder="Type college name" />

                {isCollegeLoading && <div className="text-sm text-gray-400 mt-1">Searching colleges...</div>}

                {collegeResults && collegeResults.length > 0 && activeSuggestionField === "education" && (
                  <div className="mt-1 bg-white text-black rounded shadow max-h-56 overflow-y-auto z-20">
                    {collegeResults.map((c, i) => (
                      <div key={i} className="px-3 py-2 hover:bg-gray-200 cursor-pointer" onClick={() => applySuggestion(c, "education")}>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-gray-600">{c.city || c.district || ""}{c.state ? ", " + c.state : ""}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm">Skills</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {skillChips.map((s) => (
                    <div key={s} className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded">
                      <span className="text-sm">{s}</span>
                      <button onClick={() => removeSkill(s)} className="text-xs">✕</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input name="skills" value={form.skills} onChange={handleChange} className="flex-1 p-2 rounded bg-white/5" placeholder="Comma-separated" />
                  <button onClick={generateSkills} className="px-3 py-2 bg-blue-500 text-white rounded">AI Skills</button>
                </div>
                {suggestions.length > 0 && activeSuggestionField === "skills" && (
                  <div className="mt-1 bg-white text-black rounded shadow divide-y">
                    {suggestions.map((s, i) => <div key={i} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => applySuggestion(s, "skills")}>{s}</div>)}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm">Summary</label>
                <div className="flex gap-2 mt-1">
                  <textarea name="summary" value={form.summary} onChange={handleChange} className="flex-1 p-2 rounded bg-white/5 h-24" />
                  <div className="flex flex-col gap-2">
                    <button onClick={generateSummary} className="px-3 py-2 bg-indigo-600 text-white rounded">AI Summary</button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm">Experience</label>
                <div className="flex gap-2 mt-1">
                  <textarea name="experience" value={form.experience} onChange={handleChange} className="flex-1 p-2 rounded bg-white/5 h-28" />
                  <div className="flex flex-col gap-2">
                    <button onClick={generateExperience} className="px-3 py-2 bg-purple-600 text-white rounded">AI Improve</button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm">Projects</label>
                <div className="flex gap-2 mt-1">
                  <textarea name="projects" value={form.projects} onChange={handleChange} className="flex-1 p-2 rounded bg-white/5 h-24" />
                  <div className="flex flex-col gap-2">
                    <button onClick={generateProjects} className="px-3 py-2 bg-teal-600 text-white rounded">AI Projects</button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm">Achievements</label>
                <div className="flex gap-2 mt-1">
                  <textarea name="achievements" value={form.achievements} onChange={handleChange} className="flex-1 p-2 rounded bg-white/5 h-20" />
                  <div className="flex flex-col gap-2">
                    <button onClick={generateAchievements} className="px-3 py-2 bg-yellow-500 text-black rounded">AI Achievements</button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Preview */}
          <div className="md:col-span-2 bg-white p-4 rounded shadow max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Live Preview</h2>
                <div className="text-sm text-gray-500">Template: {template}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setTemplate("modern")} className="px-3 py-1 bg-gray-100 rounded">Modern</button>
                <button onClick={() => setTemplate("classic")} className="px-3 py-1 bg-gray-100 rounded">Classic</button>
                <button onClick={() => setTemplate("creative")} className="px-3 py-1 bg-gray-100 rounded">Creative</button>
              </div>
            </div>

            <div ref={previewRef} className="p-6 border rounded bg-white text-black min-h-[900px]">
              {/* Template rendering */}
              {template === "modern" && (
                <div className="max-w-3xl mx-auto">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-3xl font-bold">{form.name || "Your Name"}</h1>
                      <div className="text-sm text-gray-600 mt-1">{form.jobTitle}</div>
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      <div>{form.email}</div>
                      <div>{form.phone}</div>
                      <div>{form.location}</div>
                    </div>
                  </div>

                  <section className="mb-4">
                    <h3 className="font-semibold">Summary</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{form.summary || "Add a short professional summary."}</p>
                  </section>

                  <section className="mb-4">
                    <h3 className="font-semibold">Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skillChips.length ? skillChips.map((s) => <span key={s} className="px-2 py-1 bg-gray-100 rounded text-sm">{s}</span>) : <div className="text-sm text-gray-500">Add skills</div>}
                    </div>
                  </section>

                  <section className="mb-4">
                    <h3 className="font-semibold">Experience</h3>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">{form.experience || "Describe your professional experience"}</div>
                  </section>

                  <section className="mb-4">
                    <h3 className="font-semibold">Projects</h3>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">{form.projects || "List projects with impact"}</div>
                  </section>

                  <section className="mb-4">
                    <h3 className="font-semibold">Education</h3>
                    <div className="text-sm text-gray-700">{form.education || "Degree, institution, year"}</div>
                  </section>

                  <section className="mb-4">
                    <h3 className="font-semibold">Achievements</h3>
                    <div className="text-sm text-gray-700">{form.achievements || "Awards & certifications"}</div>
                  </section>
                </div>
              )}

              {template === "classic" && (
                <div className="max-w-3xl mx-auto">
                  <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold">{form.name || "Your Name"}</h1>
                    <div className="text-sm text-gray-600">{form.jobTitle} • {form.location}</div>
                    <div className="text-sm text-gray-600">{form.email} • {form.phone}</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <h4 className="font-semibold">Experience</h4>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">{form.experience || "Experience details"}</div>

                      <h4 className="font-semibold mt-4">Projects</h4>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">{form.projects || "Projects"}</div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Skills</h4>
                      <div className="text-sm text-gray-700">{skillChips.join(', ')}</div>

                      <h4 className="font-semibold mt-4">Education</h4>
                      <div className="text-sm text-gray-700">{form.education}</div>
                    </div>
                  </div>
                </div>
              )}

              {template === "creative" && (
                <div className="max-w-3xl mx-auto">
                  <div className="flex gap-6 mb-6">
                    <div className="w-3/4">
                      <h1 className="text-3xl font-bold">{form.name || "Your Name"}</h1>
                      <div className="text-sm text-gray-600">{form.jobTitle}</div>
                      <p className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">{form.summary}</p>
                    </div>
                    <aside className="w-1/4 p-3 bg-gray-50 rounded">
                      <h4 className="font-semibold">Skills</h4>
                      <div className="mt-2 text-sm text-gray-700">{skillChips.join(', ')}</div>
                    </aside>
                  </div>

                  <h4 className="font-semibold">Projects</h4>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap mb-4">{form.projects}</div>

                  <h4 className="font-semibold">Experience</h4>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">{form.experience}</div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
