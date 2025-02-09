"use client";
import Navbar from "../navbar";
import React, { useState } from "react";
import registerAction from "@/actions/register";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  let [formData, setFormData] = useState({});
  let [error, setError] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      let response = await registerAction(formData);
      if (response.success) router.push("/dashboard");
      else setError(response.success);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 p-6 dark:from-[#1a1a2e] dark:via-[#1a1a2e] dark:to-[#1a1a2e]">
      <Navbar />
      <div className="hero min-h-screen">
        <div className="hero-content w-full max-w-md">
          <div className="card bg-white/90 backdrop-blur-md shadow-2xl w-full dark:bg-gray-800/90">
            <div className="card-body">
              <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent dark:from-blue-500 dark:to-purple-500">
                Create Account ✨
              </h2>
              {error ? (
                <div role="alert" className="alert alert-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Error! Email is already registerd please login</span>
                </div>
              ) : (
                ""
              )}
              <form className="space-y-4" onSubmit={handleRegister}>
                <div className="form-control" style={{ "--index": 1 }}>
                  <label className="label">
                    <span className="label-text flex items-center gap-2 dark:text-gray-200">
                      📧 Email
                    </span>
                  </label>
                  <input
                    type="email"
                    placeholder="email"
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                    }}
                    className="input input-bordered hover:border-yellow-400 focus:border-yellow-500 text-gray-800 dark:text-gray-200 dark:bg-gray-700"
                    required
                  />
                </div>
                <div className="form-control" style={{ "--index": 1 }}>
                  <label className="label">
                    <span className="label-text flex items-center gap-2 dark:text-gray-200">
                      🚽 User Name
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="User Name"
                    onChange={(e) => {
                      setFormData({ ...formData, username: e.target.value });
                    }}
                    className="input input-bordered hover:border-yellow-400 focus:border-yellow-500 text-gray-800 dark:text-gray-200 dark:bg-gray-700"
                    required
                  />
                </div>
                <div className="form-control" style={{ "--index": 2 }}>
                  <label className="label">
                    <span className="label-text flex items-center gap-2 dark:text-gray-200">
                      🔑 Password
                    </span>
                  </label>
                  <input
                    type="password"
                    placeholder="password"
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                    }}
                    className="input input-bordered hover:border-yellow-400 focus:border-yellow-500 text-gray-800 dark:text-gray-200 dark:bg-gray-700"
                    required
                  />
                </div>
                <div className="form-control mt-6">
                  <button className="btn btn-primary text-white dark:bg-blue-600 dark:hover:bg-blue-700">
                    Create Account ✨
                  </button>
                </div>
                <p className="text-center text-sm text-gray-600 mt-4 dark:text-gray-400">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-yellow-600 hover:text-yellow-700 font-medium dark:text-blue-400 dark:hover:text-blue-500"
                  >
                    Login here
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
