import React from "react";

function PremiumTemplates() {
  return (
    <div className="text-white p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Premium Resume Templates</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map((id) => (
          <div key={id} className="bg-white/10 p-4 rounded-xl">
            <div className="h-56 bg-gray-700 rounded mb-3"></div>
            <button className="w-full bg-yellow-400 text-black py-2 rounded font-bold">
              Use Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PremiumTemplates;
