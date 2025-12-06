import React from "react";

export default function Comingsoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white px-6 relative overflow-hidden">

      {/* 🔥 Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="absolute inset-0 animate-bgMove opacity-30 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.25),transparent_60%)]"></div>
      </div>

      {/* 🔥 Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full opacity-60 animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></span>
        ))}
      </div>

      {/* MAIN TEXT */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-400 mb-4 animate-float">
        🚧 Coming Soon
      </h1>

      <p className="text-gray-300 text-lg sm:text-xl text-center max-w-lg animate-fadeIn">
        This feature is currently being developed.  
        We're working hard to bring it to you soon! ✨
      </p>

      {/* LOADING DOTS */}
      <div className="flex space-x-2 mt-6">
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce [animation-delay:0.15s]"></div>
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce [animation-delay:0.3s]"></div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(-6px); }
          50% { transform: translateY(6px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s ease-out forwards;
        }

        @keyframes bgMove {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.3) translate(-20px, 20px); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .animate-bgMove {
          animation: bgMove 12s ease-in-out infinite;
        }

        @keyframes particle {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { opacity: 1; }
          100% { transform: translateY(-40px) scale(0.8); opacity: 0; }
        }
        .animate-particle {
          animation-name: particle;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}
