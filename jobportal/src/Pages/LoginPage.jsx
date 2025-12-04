import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import ButtonLoader from "../Loader/ButtonLoader";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setRedirecting(true);
        setTimeout(() => navigate("/find-jobs"), 1200);
      }
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-mine-shaft-950 text-white px-4">

      {/* CARD */}
      <form
        onSubmit={handleSubmit}
        className="
          bg-mine-shaft-900 p-8 sm:p-10 rounded-2xl w-full max-w-[420px]
          border border-mine-shaft-800 shadow-xl
          transform transition-all duration-500 
          hover:shadow-bright-sun-300/20 hover:-translate-y-1
          animate-[fadeIn_0.7s_ease-out]
        "
      >
        {/* TITLE */}
        <h2 className="text-3xl font-bold mb-6 text-bright-sun-300 text-center">
          Login
        </h2>

        {/* EMAIL */}
        <div className="mb-5">
          <label className="text-sm text-mine-shaft-300">Email</label>
          <input
            type="email"
            required
            className="
              w-full p-3 bg-mine-shaft-800 rounded-lg mt-1
              border border-mine-shaft-700
              focus:ring-2 focus:ring-bright-sun-300 focus:border-bright-sun-300
              transition duration-300
            "
            placeholder="Enter email"
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
              w-full p-3 bg-mine-shaft-800 rounded-lg mt-1
              border border-mine-shaft-700 
              focus:ring-2 focus:ring-bright-sun-300 focus:border-bright-sun-300
              transition duration-300
            "
            placeholder="Enter password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <div
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute right-4 top-[52px] cursor-pointer 
              text-mine-shaft-400 hover:text-bright-sun-300 transition
            "
          >
            {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-400 text-sm mb-3 text-center animate-pulse">
            {error}
          </p>
        )}

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          disabled={loading || redirecting}
          className="
            w-full bg-bright-sun-300 text-black py-3 rounded-lg font-semibold
            shadow-md hover:bg-bright-sun-200 hover:scale-[1.02]
            active:scale-95 transition-all duration-300
            flex justify-center items-center
          "
        >
          {redirecting ? (
            <span className="scale-50">
              <ButtonLoader />
            </span>
          ) : loading ? (
            "Logging in..."
          ) : (
            "Login"
          )}
        </button>

        {/* SIGN UP LINK */}
        <p className="mt-4 text-sm text-center text-mine-shaft-300">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-bright-sun-300 cursor-pointer hover:text-bright-sun-200 transition"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
