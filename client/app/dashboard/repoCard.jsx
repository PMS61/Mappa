import React, { useState } from "react";
import addCollabAction from "@/actions/addCollab";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FaUserPlus, FaCode, FaTimes } from "react-icons/fa";

const CardWithModal = ({ index, icon, label, value, color }) => {
  const [showAddCollabModal, setShowAddCollabModal] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState("");
  const [accessType, setAccessType] = useState("view");
  const [collaborators, setCollaborators] = useState([]);
  const [repoMade, setRepoMade] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    setError("");
    setRepoMade(false);

    try {
      const result = await addCollabAction(
        newCollaborator,
        label,
        value,
        accessType,
      );
      if (result.success) {
        setCollaborators([
          ...collaborators,
          { name: newCollaborator, access: accessType },
        ]);
        setNewCollaborator("");
        setAccessType("view");
        setRepoMade(true);
        setTimeout(() => {
          setShowAddCollabModal(false);
          setRepoMade(false);
        }, 2000); // Close modal after 2 seconds
      } else {
        setError(result.error || "Failed to add collaborator.");
      }
    } catch (e) {
      console.log(e);
      setError("An unexpected error occurred.");
    }
  };

  const handleOpenCodeSpace = () => {
    Cookies.set("repo_id", value, { expires: 10 });
    Cookies.set("repo_name", label, { expires: 10 });
    router.push("/codespace");
  };

  return (
    <>
      <div
        className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 animate-fadeIn`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-4 text-blue-500">{icon}</span>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {label}
              </h3>
            </div>
          </div>
          <div className="mt-auto flex gap-3">
            <button
              onClick={() => setShowAddCollabModal(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <FaUserPlus />
              Add Collab
            </button>
            <button
              onClick={handleOpenCodeSpace}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <FaCode />
              CodeSpace
            </button>
          </div>
        </div>
      </div>

      {/* Add Collaborator Modal */}
      {showAddCollabModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white p-8 rounded-lg shadow-2xl dark:bg-gray-800 w-full max-w-md m-4 transform transition-transform duration-300 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Add Collaborator
              </h2>
              <button
                onClick={() => setShowAddCollabModal(false)}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {repoMade && (
              <div
                role="alert"
                className="alert alert-success bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md"
              >
                <span>New Collaborator Added Successfully!</span>
              </div>
            )}
            {error && (
              <div
                role="alert"
                className="alert alert-error bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md"
              >
                <span>{error}</span>
              </div>
            )}

            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add a new collaborator to{" "}
              <span className="font-semibold">{label}</span>.
            </p>
            <form onSubmit={handleAddCollaborator} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={newCollaborator}
                  onChange={(e) => setNewCollaborator(e.target.value)}
                  placeholder="Enter collaborator's username"
                  className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Access Level
                </label>
                <select
                  value={accessType}
                  onChange={(e) => setAccessType(e.target.value)}
                  className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                  <option value="view">View</option>
                  <option value="edit">Edit</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddCollabModal(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md font-medium transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CardWithModal;
