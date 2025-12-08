import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function VoiceAgent() {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [promptVisible, setPromptVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ⭐ Backend AI chat endpoint
  const AI_ENDPOINT =
    "https://jobportalserver-production-0346.up.railway.app/api/ai/resume/chat";

  /* ================================================
      PAGE NAVIGATION COMMANDS
  ================================================= */
  const commands = [
    { keywords: ["upload job", "post job", "add job"], path: "/upload-job" },
    { keywords: ["find jobs", "search jobs"], path: "/find-jobs" },
    { keywords: ["find talent", "hire"], path: "/find-talent" },
    { keywords: ["applications"], path: "/applications" },
    { keywords: ["profile"], path: "/profile" },
    { keywords: ["resume builder"], path: "/ai-resume-builder" },
    { keywords: ["premium"], path: "/premium" },
    { keywords: ["ats score"], path: "/ats-score" },
    { keywords: ["resume tools"], path: "/resume-tools" },
    { keywords: ["home", "go home"], path: "/" },

    // ⭐ Custom command to answer creator name
    {
      keywords: [
        "who created this website",
        "who made this website",
        "website creator",
        "who is the developer",
        "who build this website"
      ],
      path: "CREATOR",
    },
  ];

  /* =========================================================
        TEXT-TO-SPEECH (AI Response Output)
  ========================================================= */
  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.pitch = 1;
    utter.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  /* =========================================================
        CHECK IF USER SPOKE A COMMAND
  ========================================================= */
  const matchCommand = (spoken) => {
    const normalized = spoken.toLowerCase();
    for (let cmd of commands) {
      for (let key of cmd.keywords) {
        if (normalized.includes(key)) return cmd.path;
      }
    }
    return null;
  };

  /* =========================================================
        AI CHAT REQUEST (FOR QUESTIONS)
  ========================================================= */
  const askAI = async (question) => {
    try {
      setTranscript((prev) => prev + "\nAI: ...thinking...");

      const response = await fetch(AI_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: question }),
      });

      const data = await response.json();
      const reply = data.reply || "Sorry, I am not sure about that.";

      setTranscript((prev) =>
        prev.replace("AI: ...thinking...", "AI: " + reply)
      );

      speak(reply);
    } catch (err) {
      speak("I am unable to reach the server right now.");
      console.error(err);
    }
  };

  /* =========================================================
         INITIALIZE VOICE ENGINE
  ========================================================= */
  useEffect(() => {
    if (!SpeechRecognition) {
      setErrorMsg("Your browser does not support voice recognition.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = false;
    recog.continuous = false;

    recognitionRef.current = recog;

    recog.onstart = () => setPromptVisible(true);

    recog.onresult = (event) => {
      const spoken = event.results[0][0].transcript;

      setTranscript((prev) => "You: " + spoken + "\n" + prev);

      const route = matchCommand(spoken);

      // ⭐ SPECIAL FIXED ANSWER: "Who created this website?"
      if (route === "CREATOR") {
        const reply = "This website was created by Raj.";
        setTranscript((prev) => "AI: " + reply + "\n" + prev);
        speak(reply);
        return;
      }

      // ⭐ Normal navigation
      if (route && route !== "CREATOR") {
        speak("Opening " + route.replace("/", "").replace("-", " "));
        setTimeout(() => navigate(route), 600);
      } else {
        askAI(spoken); // Fallback: Ask backend AI
      }
    };

    recog.onerror = () => {
      speak("I couldn't understand. Please try again.");
      setListening(false);
    };

    recog.onend = () => {
      setListening(false);
      setPromptVisible(false);
    };
  }, []);

  /* =========================================================
          START LISTENING
  ========================================================= */
  const startListening = () => {
    if (!recognitionRef.current) return;

    setListening(true);
    setPromptVisible(true);
    speak("I'm listening.");

    recognitionRef.current.start();
  };

  /* =========================================================
                          UI
  ========================================================= */
  return (
    <>
      {/* 🎤 Floating Mic Button */}
      <button
        onClick={startListening}
        className={`fixed bottom-8 right-8 z-[9999] w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-xl transition-all duration-300 border border-white/20
        ${listening ? "bg-red-500 animate-pulse" : "bg-yellow-400 hover:bg-yellow-300"}`}
      >
        🎤
      </button>

      {/* Listening Prompt */}
      {promptVisible && (
        <div className="fixed bottom-28 right-10 bg-black/70 backdrop-blur-xl px-5 py-3 rounded-xl text-white text-sm shadow-xl animate-fadeIn z-[9999]">
          Listening…
        </div>
      )}

      {/* Transcript Chat Window */}
      {transcript && (
        <div className="fixed bottom-24 right-28 max-w-xs max-h-48 overflow-y-auto 
        bg-black/60 backdrop-blur-xl px-4 py-3 rounded-xl text-white 
        text-sm shadow-lg animate-fadeIn whitespace-pre-line">
          {transcript}
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <div className="fixed bottom-5 left-5 bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      {/* Internal CSS */}
      <style>{`
        .animate-pulse {
          animation: pulse 1.2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 10px rgba(255,70,70,0.6); }
          50% { box-shadow: 0 0 25px rgba(255,120,120,0.9); }
          100% { box-shadow: 0 0 10px rgba(255,70,70,0.6); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

export default VoiceAgent;
