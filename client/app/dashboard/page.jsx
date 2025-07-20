"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import createRepoAction from "@/actions/newRepo";
import {
  createOrgAction,
  fetchOrgsByUidAction,
  createAddCollabs,
} from "@/actions/org";
import fetchReposAction from "@/actions/allRepos";
import Navbar from "../navbar";
import CardWithModal from "./repoCard";
import {
  FaFolder,
  FaFolderPlus,
  FaPlus,
  FaUsers,
  FaTimes,
} from "react-icons/fa";

const DashboardPage = () => {
  const [repositories, setRepositories] = useState([]);
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
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [getOrgErr, setGetOrgErr] = useState(false);

  useEffect(() => {
    const fetchAllOrgs = async () => {
      try {
        const result = await fetchOrgsByUidAction();
        if (result.success && result.orgs.orgs) {
          const orgItems = result.orgs.orgs.map((org) => ({
            icon: <FaFolder />,
            label: org.org_name,
            org_id: org.org_id,
          }));
          setSidebarItems(orgItems);
          if (!selectedOrg && orgItems.length > 0) {
            setSelectedOrg(orgItems[0]);
            Cookies.set("org", orgItems[0].label);
            Cookies.set("org_id", orgItems[0].org_id);
          }
          setGetOrgErr(false);
        } else {
          setGetOrgErr(true);
          setSidebarItems([]);
          console.error(result.error);
        }
      } catch (error) {
        setGetOrgErr(true);
        console.error("Error fetching organizations:", error);
      }
    };
    fetchAllOrgs();
  }, [orgMade]);

  useEffect(() => {
    const fetchAllRepos = async () => {
      if (!selectedOrg) return;
      try {
        const result = await fetchReposAction();
        if (result.success) {
          setRepositories(result.repos);
        } else {
          setRepositories([]);
          console.error(result.error);
        }
      } catch (error) {
        setRepositories([]);
        console.error("Error fetching repositories:", error);
      }
    };
    fetchAllRepos();
  }, [selectedOrg, repoMade]);

  const handleAddRepo = async (e) => {
    e.preventDefault();
    if (!newRepoName.trim()) return;
    try {
      const result = await createRepoAction(newRepoName);
      if (result.success) {
        setNewRepoName("");
        setRepoMade(!repoMade); // Toggle to trigger refetch
        setShowAddRepoModal(false);
      } else {
        setError(result.error || "Failed to create repository.");
      }
    } catch (e) {
      setError("An unexpected error occurred.");
      console.log(e);
    }
  };

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    try {
      const result = await createOrgAction(newOrgName);
      if (result.success) {
        setNewOrgName("");
        setOrgMade(!orgMade); // Toggle to trigger refetch
        setShowOrgModal(false);
      } else {
        setError(result.error || "Failed to create organization.");
      }
    } catch (e) {
      setError("An unexpected error occurred.");
      console.log(e);
    }
  };

  const handleAddCollab = async (e) => {
    e.preventDefault();
    if (!newCollaboratorName.trim() || !selectedOrg) return;
    try {
      const result = await createAddCollabs(
        selectedOrg.label,
        newCollaboratorName,
      );
      if (result.success) {
        setNewCollaboratorName("");
        setShowAddCollaboratorModal(false);
        // Optionally, show a success message
      } else {
        setError(result.error || "Failed to add collaborator.");
      }
    } catch (e) {
      setError("An unexpected error occurred.");
      console.log(e);
    }
  };

  const handleSelectOrg = (org) => {
    setSelectedOrg(org);
    Cookies.set("org", org.label);
    Cookies.set("org_id", org.org_id);
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md m-4 transform transition-transform scale-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <FaTimes />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-row container mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Sidebar */}
        <aside className="w-1/4 hidden lg:block">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg h-full">
            <button
              onClick={() => setShowOrgModal(true)}
              className="w-full flex items-center justify-center gap-2 mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaFolderPlus />
              Create Organization
            </button>
            <nav className="space-y-2">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Organizations
              </h3>
              {sidebarItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectOrg(item)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedOrg?.org_id === item.org_id
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
              {getOrgErr && (
                <p className="px-3 text-sm text-red-500">
                  Could not load organizations.
                </p>
              )}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 md:p-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedOrg?.label || "Dashboard"}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Your projects and repositories.
                </p>
              </div>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <button
                  onClick={() => setShowAddCollaboratorModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <FaUsers />
                  <span>Add Member</span>
                </button>
                <button
                  onClick={() => setShowAddRepoModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaPlus />
                  <span>New Repo</span>
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {repositories.length > 0 ? (
                repositories.map((repo, index) => (
                  <CardWithModal
                    key={index}
                    index={index}
                    icon={<FaFolder />}
                    label={repo.repo_name}
                    value={repo.repo_id}
                    color="from-blue-50 to-blue-100 dark:from-blue-800/50 dark:to-blue-700/50"
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    No repositories found. Create one to get started!
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showAddRepoModal}
        onClose={() => setShowAddRepoModal(false)}
        title="Create New Repository"
      >
        <form onSubmit={handleAddRepo}>
          <input
            type="text"
            value={newRepoName}
            onChange={(e) => setNewRepoName(e.target.value)}
            placeholder="Repository name"
            className="w-full p-3 border rounded-md mb-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowAddRepoModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showOrgModal}
        onClose={() => setShowOrgModal(false)}
        title="Create New Organization"
      >
        <form onSubmit={handleCreateOrg}>
          <input
            type="text"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            placeholder="Organization name"
            className="w-full p-3 border rounded-md mb-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowOrgModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showAddCollaboratorModal}
        onClose={() => setShowAddCollaboratorModal(false)}
        title="Add Organization Member"
      >
        <form onSubmit={handleAddCollab}>
          <input
            type="text"
            value={newCollaboratorName}
            onChange={(e) => setNewCollaboratorName(e.target.value)}
            placeholder="Collaborator username"
            className="w-full p-3 border rounded-md mb-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowAddCollaboratorModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;
