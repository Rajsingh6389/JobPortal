import React from "react";
import studentimg from "../assets/Student.png";
import { TextInput, Avatar } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import avatar1 from "../assets/avatar.png";
import avatar2 from "../assets/avatar-2.png";
import avatar3 from "../assets/avatar-3.png";

function Dreamjob() {
  return (
    <section
      className="
        flex flex-col-reverse lg:flex-row 
        items-center justify-between 
        px-6 sm:px-10 md:px-16 lg:px-20 
        pt-10 lg:pt-20 gap-10
      "
    >
      {/* LEFT CONTENT */}
      <div className="flex flex-col w-full lg:w-1/2 space-y-5">

        {/* TITLE */}
        <h1 className="
            text-4xl sm:text-5xl lg:text-6xl 
            font-bold text-mine-shaft-100 
            leading-tight
            [&>span]:text-bright-sun-400
          "
        >
          Find Your <span>Dream</span> <span>Job</span>
        </h1>

        {/* SUBTEXT */}
        <p className="text-mine-shaft-200 text-base sm:text-lg max-w-lg">
          Good life begins with a good job. Explore thousands of opportunities tailored to your skills.
        </p>

        {/* SEARCH BAR AREA */}
        <div className="
            flex flex-col sm:flex-row 
            gap-4 sm:gap-3 pt-5 
            w-full sm:w-[90%] lg:w-full
          "
        >
          {/* Job Title */}
          <TextInput
            variant="unstyled"
            placeholder="Software Engineer"
            label="Job Title"
            className="
              border border-mine-shaft-400
              rounded-md px-2 py-3
              text-mine-shaft-200 hover:border-bright-sun-300
              transition w-full
            "
          />

          {/* Job Type */}
          <TextInput
            variant="unstyled"
            placeholder="Full-time"
            label="Job Type"
            className="
              border border-mine-shaft-400
              rounded-md px-2 py-3
              text-mine-shaft-200 hover:border-bright-sun-300
              transition w-full
            "
          />

          {/* Search button */}
          <button
            type="button"
            className="
              bg-bright-sun-500 hover:bg-bright-sun-400
              rounded-md flex items-center justify-center
              p-4 sm:p-5
              transition active:scale-95
              w-full sm:w-16
            "
          >
            <IconSearch className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
          </button>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE + AVATARS */}
      <div className="w-full lg:w-1/2 flex justify-center items-center relative">
        <img
          src={studentimg}
          alt="student"
          className="w-60 sm:w-72 md:w-80 lg:w-[22rem] mx-auto drop-shadow-xl"
        />

        {/* Avatar Group (Floating) */}
        <div
          className="
            absolute right-4 bottom-4 sm:right-10 sm:bottom-10 
            bg-mine-shaft-900/80 backdrop-blur-md 
            border border-bright-sun-300/40 rounded-xl 
            p-2 shadow-xl
          "
        >
          <Avatar.Group spacing="sm">
            <Avatar src={avatar1} />
            <Avatar src={avatar2} />
            <Avatar src={avatar3} />
            <Avatar>+5</Avatar>
          </Avatar.Group>
        </div>
      </div>
    </section>
  );
}

export default Dreamjob;
