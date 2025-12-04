import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import {
  IconUser,
  IconMail,
  IconBriefcase,
  IconLogout,
  IconEdit,
  IconMapPin,
  IconCurrencyRupee,
  IconIdBadge,
  IconBrandLinkedin,
  IconBrandGithub,
} from "@tabler/icons-react";
import avtimg from "../assets/avatar-3.png";
import { useNavigate } from "react-router-dom";
import { getProfileApi } from "../api/profileApi";
import EditProfileModal from "./EditProfileModal";
import Loader from "../Findjobs/Loader";
import { Badge, Divider } from "@mantine/core";

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await getProfileApi();
      setProfile(res.data);
    } catch (err) {
      navigate("/login");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
    fetchProfile();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center bg-mine-shaft-950">
        <Loader />
      </div>
    );

  if (!profile)
    return (
      <div className="h-screen flex justify-center items-center text-red-400">
        Failed to load profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-mine-shaft-950 text-white py-12 px-4 flex justify-center font-poppins">

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-10 animate-[fadeIn_0.6s_ease]">

        {/* LEFT CARD */}
        <div className="bg-mine-shaft-900/75 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-mine-shaft-800">

          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <img
              src={avtimg}
              alt="profile"
              className="w-32 h-32 rounded-full border-4 border-bright-sun-300 shadow-2xl"
            />

            {/* Name */}
            <h1 className="text-3xl font-bold text-bright-sun-300 mt-4">
              {profile.name}
            </h1>

            {/* Email */}
            <p className="flex items-center gap-2 text-mine-shaft-300 mt-2">
              <IconMail size={18} /> {profile.email}
            </p>

            {/* Role */}
            <Badge
              color={profile.userType === "ADMIN" ? "red" : "yellow"}
              size="lg"
              className="mt-3"
            >
              {profile.userType}
            </Badge>

            {/* Edit Button */}
            <button
              onClick={() => setEditing(true)}
              className="
                mt-5 bg-bright-sun-300 px-5 py-2 rounded-xl text-black font-semibold
                flex items-center gap-2 hover:bg-bright-sun-200 transition
              "
            >
              <IconEdit size={18} /> Edit Profile
            </button>
          </div>

          <Divider className="my-6" />

          {/* Socials */}
          <div className="flex justify-center gap-6 text-bright-sun-300 mt-4">
            <IconBrandLinkedin size={32} className="cursor-pointer hover:scale-110 transition" />
            <IconBrandGithub size={32} className="cursor-pointer hover:scale-110 transition" />
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="lg:col-span-2 space-y-8">

          {/* ABOUT */}
          <CardSection title="About Me" icon={<IconUser />} content={
            profile.about || "No details added"
          } />

          {/* JOB PREFS */}
          <div className="bg-mine-shaft-900/60 p-7 rounded-2xl border border-mine-shaft-700 shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-semibold text-bright-sun-200 flex items-center gap-2">
              <IconBriefcase /> Job Preferences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 text-mine-shaft-300 text-lg">

              <InfoRow icon={<IconIdBadge className="text-bright-sun-300" />} label="Role" value={profile.role} />

              <InfoRow icon={<IconMapPin className="text-bright-sun-300" />} label="Location" value={profile.location} />

              <InfoRow icon={<IconCurrencyRupee className="text-bright-sun-300" />} label="Expected Salary" value={profile.expectedSalary} />
            </div>
          </div>

          {/* SKILLS */}
          <div className="bg-mine-shaft-900/60 p-7 rounded-2xl border border-mine-shaft-700 shadow hover:shadow-xl transition">
            <h2 className="text-2xl font-semibold text-bright-sun-200">Skills</h2>

            <div className="flex flex-wrap gap-3 mt-4">
              {(profile.skills?.split(",") || []).map((skill, i) => (
                <Badge
                  key={i}
                  color="yellow"
                  size="lg"
                  className="bg-mine-shaft-850 border border-bright-sun-300 text-bright-sun-200 px-4 py-2 rounded-xl"
                >
                  {skill.trim()}
                </Badge>
              ))}
            </div>
          </div>

          {/* LOGOUT */}
          <div className="flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/20 text-red-300
              hover:bg-red-400/20 border border-red-400
              px-6 py-3 rounded-lg font-semibold transition shadow-lg"
            >
              <IconLogout size={18} /> Logout
            </button>
          </div>
        </div>
      </div>

      {editing && (
        <EditProfileModal
          user={profile}
          close={() => setEditing(false)}
          refresh={fetchProfile}
        />
      )}
    </div>
  );
}

const CardSection = ({ title, icon, content }) => (
  <div className="bg-mine-shaft-900/60 p-7 rounded-2xl border border-mine-shaft-700 shadow hover:shadow-lg transition">
    <h2 className="text-2xl font-semibold text-bright-sun-200 flex items-center gap-2">
      {icon} {title}
    </h2>
    <p className="text-mine-shaft-300 text-lg mt-2">{content}</p>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <p className="flex items-center gap-2">
    {icon}
    <b>{label}:</b> {value || "Not added"}
  </p>
);

export default ProfilePage;
