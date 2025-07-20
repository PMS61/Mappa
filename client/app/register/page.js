"use client";
import Navbar from "../navbar";
import React, { useState } from "react";
import registerAction from "@/actions/register";
import { useRouter } from "next/navigation";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaExclamationCircle,
} from "react-icons/fa";

const RegisterPage = () => {
  const router = useRouter();
  let [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  let [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      let response = await registerAction(formData);
      if (response.success) {
        router.push("/dashboard");
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 md:p-10">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Create Your Account
            </h2>
            {error && (
              <div
                role="alert"
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md flex items-center gap-3"
              >
                <FaExclamationCircle />
                <p>
                  This email may already be registered. Please try logging in.
                </p>
              </div>
            )}
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="relative">
                <FaEnvelope className="absolute top-3.5 left-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  onChange={handleChange}
                  className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition-colors"
                  required
                />
              </div>
              <div className="relative">
                <FaUser className="absolute top-3.5 left-4 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition-colors"
                  required
                />
              </div>
              <div className="relative">
                <FaLock className="absolute top-3.5 left-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className="w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition-colors"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
              <p className="text-center text-sm text-gray-600 mt-4 dark:text-gray-400">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Log in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
