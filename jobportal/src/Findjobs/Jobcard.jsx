import { Button, Divider, Text } from "@mantine/core";
import { 
  IconBookmark, 
  IconClockHour3, 
  IconUsers, 
  IconMapPin 
} from "@tabler/icons-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Jobcard({ data }) {
  const isLoggedIn = useSelector((state) => state.auth.token !== null);
  const navigate = useNavigate();

  const handleApply = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate(`/find-jobs/${data?.id}`);
  };

  return (
    <div
      className="
      bg-mine-shaft-800 p-4 rounded-xl w-full
      transition-all duration-300 ease-out
      hover:scale-[1.03] hover:-translate-y-2
      hover:shadow-lg hover:shadow-bright-sun-400/20
      hover:border hover:border-bright-sun-300/40
      flex flex-col justify-between
      "
    >
      {/* TOP SECTION */}
      <div className="flex justify-between">
        <div className="flex gap-3 items-center">
          <div className="p-2 bg-mine-shaft-900 rounded-md flex items-center justify-center">
            <img
              className="h-7 w-4 object-contain"
              src={`/Icons/${data?.company}.png`}
              alt={data?.company}
              onError={(e) => {
                e.target.src = "/Icons/default.png"; // fallback logo
              }}
            />
          </div>

          <div className="leading-tight">
            <div className="font-semibold text-mine-shaft-100 text-sm sm:text-base">
              {data?.jobTitle}
            </div>

            <div className="text-xs sm:text-sm text-mine-shaft-400 flex items-center gap-1">
              {data?.company} • {data?.applicants} Applicants
            </div>
          </div>
        </div>

        <IconBookmark className="text-mine-shaft-400" size={20} />
      </div>

      {/* TAGS */}
      <div className="flex gap-2 mt-3 flex-wrap">
        <div className="px-2 py-1 bg-mine-shaft-900 rounded-lg text-bright-sun-400 text-xs">
          {data?.experience}
        </div>

        <div className="px-2 py-1 bg-mine-shaft-900 rounded-lg text-bright-sun-400 text-xs">
          {data?.jobType}
        </div>

        <div className="px-2 py-1 bg-mine-shaft-900 rounded-lg text-bright-sun-400 text-xs flex items-center gap-1">
          <IconMapPin size={12} />
          {data?.location}
        </div>
      </div>

      {/* DESCRIPTION */}
      <Text 
        className="text-xs sm:text-sm text-justify text-mine-shaft-300 mt-2"
        lineClamp={3}
      >
        {data?.description}
      </Text>

      <Divider className="mt-4" size="xs" color="mine-shaft.7" />

      {/* BOTTOM SECTION */}
      <div className="flex justify-between mt-3 items-center">
        <div className="text-mine-shaft-200 font-semibold text-sm sm:text-base">
          ₹{data?.packageAmount}
        </div>

        <Button
          size="xs"
          className="bg-bright-sun-300 text-black font-semibold hover:bg-bright-sun-400"
          onClick={handleApply}
        >
          Apply
        </Button>

        <div className="flex gap-1 items-center text-mine-shaft-400 text-xs sm:text-sm">
          <IconClockHour3 size={16} />
          {data?.postedDaysAgo}d
        </div>
      </div>
    </div>
  );
}

export default Jobcard;
