"use client";

import React, { useEffect, useState } from "react";
import CardWithModal from "./repoCard";
import Button from "./Button";
import Cookies from "js-cookie";
import createRepoAction from "@/actions/newRepo";
import fetchReposAction from "@/actions/allRepos"; // Ensure correct import path

const Page = () => {
  const [username, setUsername] = useState("");
  const [repositories, setRepositories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRepo, setCurrentRepo] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaborator, setNewCollaborator] = useState("");
  const [accessType, setAccessType] = useState("view");
  const [showAddRepoModal, setShowAddRepoModal] = useState(false);
  const [newRepoName, setNewRepoName] = useState("");
  const [repoMade, setRepoMade] = useState(false);
  useEffect(() => {
    setUsername(Cookies.get("username") || "Guest");
    const fetchAllRepos = async () => {
      try {
        const result = await fetchReposAction();
        if (result.success) {
          setRepositories(result.repos);
          console.log(result.repos);
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };
    fetchAllRepos();
  }, [repoMade]);
  const handleAddRepo = async (e) => {
    e.preventDefault();
    try {
      const result = await createRepoAction(newRepoName);
      if (result.success) {
        setNewRepoName("");
        setRepoMade(true);
      } else {
        setRepoMade(false);
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 p-6 dark:from-[#1a1a2e] dark:via-[#1a1a2e] dark:to-[#1a1a2e]">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 border-2 border-yellow-200 dark:bg-gray-800/90 dark:border-gray-700">
          {/* Header section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent mb-2 dark:from-blue-500 dark:to-purple-500">
                Welcome Back, {username}! ✨
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Here`s your personal dashboard
              </p>
            </div>
            <Button
              onClick={() => setShowAddRepoModal(true)}
              className="btn bg-green-100 text-green-800 hover:bg-green-200 px-6 rounded-full flex items-center gap-2 dark:bg-green-700 dark:text-green-200 dark:hover:bg-green-600"
              icon="➕"
              label="Add Repo"
            />
          </div>

          {/* Repositories info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map((repo, index) => (
              <CardWithModal
                key={index}
                index={index}
                icon="📁"
                label={repo.repo_name}
                value={repo.repo_id}
                color="from-blue-50 to-blue-100 dark:from-blue-700 dark:to-blue-500"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add Repo Modal */}
      {showAddRepoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 w-96">
            {repoMade ? (
              <div role="alert" className="alert alert-success">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>New Repository Created Successfully!</span>
              </div>
            ) : (
              ""
            )}
            <h2 className="text-xl font-bold mb-4">Create a New Repository</h2>
            <input
              type="text"
              value={newRepoName}
              onChange={(e) => setNewRepoName(e.target.value)}
              placeholder="Enter repository name"
              className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <div className="flex flex-row gap-4 justify-center">
              <button
                onClick={handleAddRepo}
                className="btn self-center bg-green-100 text-green-800 hover:bg-green-200 px-4 py-2 rounded-full dark:bg-green-700 dark:text-green-200 dark:hover:bg-green-600 mt-2"
              >
                Add Repository
              </button>
              <button
                onClick={() => setShowAddRepoModal(false)}
                className="btn bg-gray-100 self-center text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-full dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
