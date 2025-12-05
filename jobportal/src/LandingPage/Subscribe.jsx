import React from "react";
import { TextInput, Button } from "@mantine/core";

function Subscribe() {
  return (
    <section
      className="
        bg-mine-shaft-900 
        mt-20 mx-3 sm:mx-8 md:mx-16 
        rounded-xl 
        py-10 px-5 
        flex flex-col items-center 
        text-center gap-6
        overflow-hidden
      "
    >
      {/* Heading */}
      <h2
        className="
          text-2xl sm:text-3xl md:text-4xl 
          font-semibold text-mine-shaft-100
        "
      >
        Never miss <span className="text-bright-sun-400">Job News</span>
      </h2>

      {/* SUBTEXT */}
      <p className="text-mine-shaft-300 max-w-md text-sm sm:text-base">
        Subscribe now to get the latest hiring updates and job alerts delivered
        straight to your inbox.
      </p>

      {/* Input + Button */}
      <div
        className="
          flex flex-col sm:flex-row 
          items-stretch 
          w-full max-w-md 
          rounded-lg overflow-hidden
          bg-mine-shaft-800 border border-mine-shaft-700
        "
      >
        <TextInput
          variant="unstyled"
          placeholder="your@email.com"
          className="
            flex-1 px-4 py-3 text-white 
            placeholder-gray-400 text-sm sm:text-base
          "
        />

        <Button
          fullWidth
          color="yellow"
          variant="filled"
          className="
            sm:w-auto 
            px-6 py-3 
            text-black font-semibold 
            hover:bg-bright-sun-300 
            transition-all
          "
        >
          Subscribe
        </Button>
      </div>
    </section>
  );
}

export default Subscribe;
