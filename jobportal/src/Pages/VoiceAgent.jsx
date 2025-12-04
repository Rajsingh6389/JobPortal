import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function VoiceAgent() {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /* ================================
        COMMANDS TABLE
  =================================*/
  const commands = [
    { keywords: ["upload job", "post job", "open upload", "add job"], path: "/upload-job" },
    { keywords: ["find jobs", "jobs", "search jobs"], path: "/find-jobs" },
    { keywords: ["find talent", "hire", "recruit"], path: "/find-talent" },
    { keywords: ["view applications", "applications"], path: "/applications" },
    { keywords: ["about", "about us"], path: "/about" },
    { keywords: ["home", "homepage", "go home"], path: "/" },
    { keywords: ["profile", "my profile"], path: "/profile" },
    { keywords: ["login", "sign in"], path: "/login" },
    { keywords: ["signup", "register"], path: "/signup" },
  ];

  /* ======================================
        TEXT-TO-SPEECH (Voice Output)
  ======================================*/
  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;
    window.speechSynthesis.speak(utter);
  };

  /* ==========================================
        COMMAND MATCHING (Improved AI Logic)
  ==========================================*/
  const matchCommand = (text) => {
    const normalized = text.toLowerCase();

    for (let cmd of commands) {
      for (let word of cmd.keywords) {
        if (normalized.includes(word)) return cmd.path;
      }
    }
    return null;
  };

  /* ======================================
        INITIALIZE SPEECH RECOGNITION
  ======================================*/
  useEffect(() => {
    if (!SpeechRecognition) {
      setErrorMsg("⚠ Your browser does not support voice recognition.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.continuous = false;
    recog.interimResults = false;

    recognitionRef.current = recog;

    recog.onresult = (event) => {
      const spoken = event.results[0][0].transcript;
      setTranscript(spoken);
      setShowPrompt(false);

      const route = matchCommand(spoken);

      if (route) {
        speak("Opening " + route.replace("/", "").replace("-", " "));
        setTimeout(() => navigate(route), 700);
      } else {
        speak("Sorry, I didn't understand. Try saying: Find Jobs, Upload Job.");
      }
    };

    recog.onerror = () => {
      speak("I couldn't hear you clearly. Try again.");
      setListening(false);
    };

    recog.onend = () => {
      setListening(false);
      setShowPrompt(false);
    };
  }, []);

  /* ======================================
        START LISTENING
  ======================================*/
  const startListening = () => {
    if (!recognitionRef.current) return;

    if (listening) return; // prevent double start

    setTranscript("");
    setListening(true);
    setShowPrompt(true);

    speak("I'm listening.");

    recognitionRef.current.start();
  };

  /* ======================================
        UI
  ======================================*/
  return (
    <>
      {/* ==== FLOATING MIC BUTTON ==== */}
      <button
        onClick={startListening}
        className={`fixed bottom-8 right-8 z-[9999] w-16 h-16 rounded-full flex items-center justify-center text-white text-3xl shadow-xl transition-all duration-300 ${
          listening ? "mic-glow bg-red-500" : "bg-bright-sun-300 hover:bg-bright-sun-200"
        }`}
      >
        🎤
      </button>

      {/* ==== PROMPT ==== */}
      {showPrompt && (
        <div className="fixed bottom-28 right-10 bg-black/70 backdrop-blur-md px-5 py-3 rounded-xl text-white text-sm animate-fadeIn z-[9999]">
          Listening... say a command
        </div>
      )}

      {/* ==== TRANSCRIPT ==== */}
      {transcript && (
        <div className="fixed bottom-24 right-28 bg-black/40 px-4 py-2 text-white rounded-lg text-sm">
          You said: <b>{transcript}</b>
        </div>
      )}

      {/* ==== ERROR MESSAGE ==== */}
      {errorMsg && (
        <div className="fixed bottom-5 left-5 bg-red-500/20 border border-red-500 px-4 py-2 rounded-lg text-red-300 text-sm">
          {errorMsg}
        </div>
      )}

      {/* ==== CSS ANIMATIONS ==== */}
      <style>{`
        .mic-glow {
          animation: glow 1.2s infinite;
        }
        @keyframes glow {
          0% { box-shadow: 0 0 10px #ff3b30; }
          50% { box-shadow: 0 0 25px #ff8a65; }
          100% { box-shadow: 0 0 10px #ff3b30; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

export default VoiceAgent;
