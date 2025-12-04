import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(signupUser(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/login");
      }
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-mine-shaft-950 text-white">

      {/* ANIMATED CARD */}
      <form
        onSubmit={handleSubmit}
        className="
          bg-mine-shaft-900 p-10 rounded-2xl w-[90%] max-w-[450px]
          border border-mine-shaft-800 shadow-xl backdrop-blur-lg
          animate-[fadeInUp_0.8s_ease-out] transition-transform
          hover:scale-[1.03] hover:shadow-bright-sun-300/20
        "
      >
        <h2 className="text-3xl font-bold mb-2 text-bright-sun-300 text-center">
          Create Your Account
        </h2>
        <p className="text-center text-mine-shaft-400 mb-6 text-sm">
          Start your journey with JobNest today!
        </p>

        {/* FULL NAME */}
        <div className="mb-5">
          <label className="text-sm text-mine-shaft-300">Full Name</label>
          <input
            type="text"
            required
            className="
              w-full p-3 bg-mine-shaft-800 rounded-lg border border-mine-shaft-700 mt-1
              focus:ring-2 focus:ring-bright-sun-300 focus:border-bright-sun-300
              transition-all duration-300
            "
            placeholder="Enter your full name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="text-sm text-mine-shaft-300">Email Address</label>
          <input
            type="email"
            required
            className="
              w-full p-3 bg-mine-shaft-800 rounded-lg border border-mine-shaft-700 mt-1
              focus:ring-2 focus:ring-bright-sun-300 focus:border-bright-sun-300
              transition-all duration-300
            "
            placeholder="Enter your email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-5 relative">
          <label className="text-sm text-mine-shaft-300">Password</label>

          <input
            type={showPassword ? "text" : "password"}
            required
            className="
              w-full p-3 bg-mine-shaft-800 rounded-lg border border-mine-shaft-700 mt-1
              focus:ring-2 focus:ring-bright-sun-300 focus:border-bright-sun-300
              transition-all duration-300
            "
            placeholder="Create a password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <div
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute right-3 top-10 cursor-pointer 
              text-mine-shaft-400 hover:text-bright-sun-300 transition
            "
          >
            {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm mb-3 text-center animate-pulse">
            {error}
          </p>
        )}

        {/* SIGN UP BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full bg-bright-sun-300 text-black py-3 rounded-lg font-semibold
            hover:bg-bright-sun-200 hover:scale-[1.03]
            active:scale-95 transition-all duration-300
            shadow-md hover:shadow-bright-sun-400/30
          "
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {/* LOGIN LINK */}
        <p className="mt-5 text-sm text-center text-mine-shaft-300">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-bright-sun-300 cursor-pointer hover:text-bright-sun-200 transition"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignupPage;
