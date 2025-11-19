import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiCash } from "react-icons/gi";
import toast from "react-hot-toast";
import api from "../../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data, headers } = await api.post("/user/login", { email, password });

      // Backend sets token in cookie, but you can also store in localStorage if needed
      // Example: data.userExists._id or any identifier
      localStorage.setItem("token", data.userExists._id); // or any token you generate

      toast.success(data.message || "Login Successful");

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      {/* Logo + Heading */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <GiCash className="mx-auto h-12 w-12 text-primary" />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      {/* Form */}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-[--color-primary]"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-900">Password</label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-[--color-primary]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-[#efbf2f] px-3 py-2 text-sm font-semibold text-white hover:bg-[#e0a802] shadow-sm"
          >
            Sign In
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-10 text-center text-sm text-gray-500">
          Do not have an account?
          <Link
            to="/register"
            className="ml-1 font-semibold text-[--color-primary] hover:text-[#e0a802]"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
