import React from "react";
import { useSelector } from "react-redux";

function ResumeTools() {
  const user = useSelector(s => s.auth.user);

  return (
    <div className="text-white p-8">
      <h1 className="text-3xl font-bold">Welcome Premium User 🎉</h1>
      <p className="text-gray-300 mt-2">
        You now have full access to AI Resume Builder, Templates and Export.
      </p>
    </div>
  );
}

export default ResumeTools;
