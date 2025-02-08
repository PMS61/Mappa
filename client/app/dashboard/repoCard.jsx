import React, { useState } from "react";

const CardWithModal = ({ index, icon, label, value, color, onDeleteRepo }) => {
  const [showAddCollabModal, setShowAddCollabModal] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState("");
  const [accessType, setAccessType] = useState("view");
  const [collaborators, setCollaborators] = useState([]);

  const handleAddCollab = () => {
    // Logic to add collaborator
    console.log(`Add ${newCollaborator} with ${accessType} access to ${label}`);
    setCollaborators([
      ...collaborators,
      { name: newCollaborator, access: accessType },
    ]);
    setNewCollaborator("");
    setAccessType("view");
    setShowAddCollabModal(false);
  };

  return (
    <div className={`p-4 rounded-lg shadow-lg bg-gradient-to-br ${color}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="text-lg font-bold">{label}</h3>
            <p className="text-sm">{value}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddCollabModal(true)}
            className="btn bg-blue-100 text-blue-800 hover:bg-blue-200 px-2 py-1 rounded-full dark:bg-blue-700 dark:text-blue-200 dark:hover:bg-blue-600"
          >
            Add Collaborator
          </button>
        </div>
      </div>

      {/* Add Collaborator Modal */}
      {showAddCollabModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 w-96">
            <h2 className="text-xl font-bold mb-4">
              Add Collaborator to {label}
            </h2>
            <input
              type="text"
              value={newCollaborator}
              onChange={(e) => setNewCollaborator(e.target.value)}
              placeholder="Enter collaborator name"
              className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
              className="w-full p-2 border rounded mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            >
              <option value="view">View</option>
              <option value="edit">Edit</option>
            </select>
            <div className="flex flex-row gap-4 justify-center">
              <button
                onClick={handleAddCollab}
                className="btn self-center bg-green-100 text-green-800 hover:bg-green-200 px-4 py-2 rounded-full dark:bg-green-700 dark:text-green-200 dark:hover:bg-green-600 mt-2"
              >
                Add Collaborator
              </button>
              <button
                onClick={() => setShowAddCollabModal(false)}
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

export default CardWithModal;
