"use client";

import React, { useEffect, useState } from "react";
import CardWithModal from "./repoCard";
import Button from "./Button";
import Cookies from "js-cookie";
import createRepoAction from "@/actions/newRepo";
import {
  createOrgAction,
  fetchOrgsByUidAction,
  createAddCollabs,
} from "@/actions/org"; // Ensure correct import path
import fetchReposAction from "@/actions/allRepos"; // Ensure correct import path
import Navbar from "../navbar";
import { get } from "http";

const Page = () => {
  const [repositories, setRepositories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRepo, setCurrentRepo] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaborator, setNewCollaborator] = useState("");
  const [accessType, setAccessType] = useState("view");
  const [showAddRepoModal, setShowAddRepoModal] = useState(false);
  const [newRepoName, setNewRepoName] = useState("");
  const [repoMade, setRepoMade] = useState(false);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [orgMade, setOrgMade] = useState(false);
  const [showAddCollaboratorModal, setShowAddCollaboratorModal] =
    useState(false);
  const [newCollaboratorName, setNewCollaboratorName] = useState("");
  const [error, setError] = useState("");
  const [sidebarItems, setSidebarItems] = useState([]);
  const [org, setOrg] = useState();
  const [getOrgErr,setGetOrgErr] = useState(false);

  useEffect(() => {
    const fetchAllRepos = async () => {
      try {
        const result = await fetchReposAction();
        if (result.success) {
          setRepositories(result.repos);
          console.log(result.repos);
        } else {
          setRepositories([])
          console.error(result.error);
        }
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };
    let orgItems = [];
    const fetchAllOrgs = async () => {
      try {
        const result = await fetchOrgsByUidAction();
        if (result.success) {
          orgItems = result.orgs.orgs.map((org) => ({
            icon: "🗂️",
            label: org.org_name,
            org_id: org.org_id,
            color: "bg-cyan-500",
          }));
          setSidebarItems(orgItems);
          setGetOrgErr(false);
        } else {
          setGetOrgErr(true);
          console.error(result.error);
        }
      } catch (error) {
        setGetOrgErr(true);
        console.error("Error fetching organizations:", error);
      }
    };
    fetchAllOrgs();
    fetchAllRepos();
    // const intervalId = setInterval(() => {
    //   fetchAllOrgs();
    //   if (org != undefined) {
    //     fetchAllRepos();
    //   }
    // }, 500);

    // return () => clearInterval(intervalId);
  }, [repoMade, orgMade, org,getOrgErr]);

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

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    try {
      const result = await createOrgAction(newOrgName);
      if (result.success) {
        setNewOrgName("");
        setOrgMade(true);
      } else {
        setOrgMade(false);
        setError(result.error);
      }
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddCollab = async (e) => {
    e.preventDefault();
    try {
      const result = await createAddCollabs(
        Cookies.get("org"),
        newCollaboratorName,
      );
      console.log(result.orgs.orgs);
      if (result.success) {
        setNewOrgName("");
        setOrgMade(true);
      } else {
        setOrgMade(false);
        setError(result.error);
      }
    } catch (e) {
      console.log(e.error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 p-6 dark:from-[#1a1a2e] dark:via-[#1a1a2e] dark:to-[#1a1a2e]">
      <div className="flex flex-row">
        <div className="flex flex-col gap-4 px-2">
          <button
            onClick={() => setShowOrgModal(true)}
            className="rounded-3xl p-4 bg-blue-500 shadow-lg mb-6"
          >
            <p className="text-xl font-bold text-white">Create Organization</p>
          </button>
          <div className="p-4 flex flex-col gap-3 bg-white/90 backdrop-blur-md shadow-2xl rounded-xl border-2 border-yellow-200 dark:bg-gray-800/90 dark:border-gray-700">
            {sidebarItems &&
              sidebarItems.map((item, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${item.color} p-2 rounded-xl
                        bg-white/90 backdrop-blur-md
                         shadow-lg hover:shadow-xl transition-all duration-300
                         transform hover:-translate-y-1 border border-yellow-100 dark:border-gray-700
                         animate-fadeIn flex flex-row gap-4`}
                  onClick={() => {
                    Cookies.set("org", item.label); // Expires in 7 days
                    Cookies.set("org_id", item.org_id);
                    setOrg(item.label);
                  }}
                >
                  <div className="flex flex-row gap-2 cursor-pointer">
                    <p>{item.icon}</p>
                    <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 self-center">
                      {item.label}
                    </h2>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="w-5/6 mx-auto">
          <Navbar />
          <div className="mt-8 bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 border-2 border-yellow-200 dark:bg-gray-800/90 dark:border-gray-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row gap-12 justify-between items-center mb-12">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent mb-2 dark:from-blue-500 dark:to-purple-500">
                  {org}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Here`s your personal dashboard
                </p>
              </div>
              <div className="flex flex-row gap-4">
                <Button
                  onClick={() => setShowAddCollaboratorModal(true)}
                  className="btn bg-blue-100 text-blue-800 hover:bg-blue-200 px-6 rounded-full flex items-center gap-2 dark:bg-green-700 dark:text-green-200 dark:hover:bg-green-600"
                  icon="➕"
                  label="Add org collabs"
                />
                <Button
                  onClick={() => setShowAddRepoModal(true)}
                  className="btn bg-green-100 text-green-800 hover:bg-green-200 px-6 rounded-full flex items-center gap-2 dark:bg-green-700 dark:text-green-200 dark:hover:bg-green-600"
                  icon="➕"
                  label="Add Repo"
                />
              </div>
            </div>

            {/* Repositories info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <h2 className="text-xl dark:text-white font-bold mb-4">
              Create a New Repository
            </h2>
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

      {/* Create Organization Modal */}
      {showOrgModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 w-96">
            {orgMade ? (
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
                <span>New Organization Created Successfully!</span>
              </div>
            ) : (
              ""
            )}
            <h2 className="text-xl dark:text-white font-bold mb-4">
              Create a New Organization
            </h2>
            <input
              type="text"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="Enter organization name"
              className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <div className="flex flex-row gap-4 justify-center">
              <button
                // onClick={() => {
                //   handleCreateOrg();
                //   setAdmin(true);
                // }}
                onClick={handleCreateOrg}
                className="btn self-center bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 rounded-full dark:bg-blue-700 dark:text-blue-200 dark:hover:bg-blue-600 mt-2"
              >
                Create Organization
              </button>
              <button
                onClick={() => setShowOrgModal(false)}
                className="btn bg-gray-100 self-center text-gray-800 hover:bg-gray-200 px-4 py-2 rounded-full dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Collaborator Modal */}
      {showAddCollaboratorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 w-96">
            <h2 className="text-xl dark:text-white font-bold mb-4">
              Add Organization Collaborator
            </h2>
            <input
              type="text"
              value={newCollaboratorName}
              onChange={(e) => setNewCollaboratorName(e.target.value)}
              placeholder="Enter collaborator username"
              className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <div className="flex flex-row gap-4 justify-center">
              <button
                // onClick={() => {
                //   handleCreateOrg();
                //   setAdmin(false);
                // }}
                onClick={handleAddCollab}
                className="btn self-center bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 rounded-full dark:bg-blue-700 dark:text-blue-200 dark:hover:bg-blue-600 mt-2"
              >
                Add Collaborator
              </button>
              <button
                onClick={() => setShowAddCollaboratorModal(false)}
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
