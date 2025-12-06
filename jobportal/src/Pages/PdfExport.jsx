import React, { useState } from "react";
import { jsPDF } from "jspdf";
import Comingsoon from "./Comingsoon";

function PdfExport() {
  const [text, setText] = useState("");

  const download = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, 10);
    doc.save("resume.pdf");
  };

  return (
    // <div className="text-white p-8 max-w-4xl mx-auto">
    //   <h1 className="text-3xl font-bold mb-6">HD PDF Export</h1>

    //   <textarea
    //     className="w-full h-60 p-4 bg-black/40 rounded"
    //     placeholder="Paste your final resume text..."
    //     value={text}
    //     onChange={(e) => setText(e.target.value)}
    //   />

    //   <button
    //     onClick={download}
    //     className="mt-6 px-6 py-3 bg-yellow-400 text-black rounded font-bold"
    //   >
    //     Download PDF
    //   </button>
    // </div>
     <div>
          <Comingsoon />
        </div>
  );
}

export default PdfExport;
