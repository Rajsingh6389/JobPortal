import React from "react";
export default function TemplateOne({ data }) {
  return (
    <div style={{ width: "794px" }} className="bg-white text-black p-8 font-sans">
      <h1 className="text-3xl font-bold">{data.name}</h1>
      <p className="text-md text-gray-700">{data.jobTitle}</p>
      <hr className="my-4" />
      <section><h2 className="font-bold">Summary</h2><p>{data.summary}</p></section>
      <section className="mt-3"><h2 className="font-bold">Skills</h2><p>{data.skills}</p></section>
      <section className="mt-3"><h2 className="font-bold">Experience</h2><pre>{data.experience}</pre></section>
    </div>
  );
}
