import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createAddCollabs } from "@/actions/org";

const AddCollabModal = ({ isOpen, onClose, selectedOrg }) => {
  const [newCollaboratorName, setNewCollaboratorName] = useState("");
  const [error, setError] = useState("");

  const handleAddCollab = async (e) => {
    e.preventDefault();
    if (!newCollaboratorName.trim() || !selectedOrg) {
      setError("Collaborator name and organization are required.");
      return;
    }
    try {
      const result = await createAddCollabs(
        selectedOrg.label,
        newCollaboratorName,
      );
      if (result.success) {
        setNewCollaboratorName("");
        setError("");
        onClose();
        // Optionally, show a success message or trigger a refresh
      } else {
        setError(result.error || "Failed to add collaborator.");
      }
    } catch (e) {
      setError("An unexpected error occurred.");
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md m-4 transform transition-transform scale-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Add Collaborator
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleAddCollab}>
          <input
            type="text"
            value={newCollaboratorName}
            onChange={(e) => setNewCollaboratorName(e.target.value)}
            placeholder="Enter collaborator's username"
            className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Add Collaborator
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCollabModal;