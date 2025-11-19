import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { GiCash } from "react-icons/gi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/user/register", {
        name,
        email,
        password,
        confirmPassword,
      });

      // Save token in localStorage if backend returns it
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success(data.message || "Account created successfully!");

      // Navigate to dashboard directly after signup
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <GiCash className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSignup}>
          <div>
            <label className="block text-sm font-medium text-gray-900">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block w-full rounded-md bg-white px-3 py-2 outline outline-1 outline-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full rounded-md bg-white px-3 py-2 outline outline-1 outline-gray-300"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-900">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full rounded-md bg-white px-3 py-2 outline outline-1 outline-gray-300"
            />
          </div> */}

          <div className="relative mt-2">
            <label className="block text-sm font-medium text-gray-900">Password</label>
            <input
              type={showPassword ? "text" : "password"} // toggle type
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-[--color-primary] mt-2"
            />

            {/* Eye button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-1 right-3 top-6 flex items-center text-gray-600"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>


          {/* <div>
            <label className="block text-sm font-medium text-gray-900">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 block w-full rounded-md bg-white px-3 py-2 outline outline-1 outline-gray-300"
            />
          </div> */}
          <div className="relative mt-2">
            <label className="block text-sm font-medium text-gray-900">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"} // toggle type
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-[--color-primary] mt-2"
            />

            {/* Eye button */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 top-6 flex items-center text-gray-600"
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            className="flex w-full justify-center bg-[#efbf2f] px-3 py-2 text-white rounded-md"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/" className="text-primary font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
