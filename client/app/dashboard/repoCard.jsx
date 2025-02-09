import React, { useState } from "react";
import addCollabAction from "@/actions/addCollab";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
const CardWithModal = ({ index, icon, label, value, color }) => {
  const [showAddCollabModal, setShowAddCollabModal] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState("");
  const [accessType, setAccessType] = useState("view");
  const [collaborators, setCollaborators] = useState([]);
  const [repoMade, setRepoMade] = useState(false);
  const router = useRouter();
  const handleAddCollaborator = async (e) => {
    e.preventDefault();
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
        setShowModal(false);
      } else {
        console.error(result.error);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className={`p-4 rounded-lg shadow-lg bg-gradient-to-br ${color}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="text-lg font-bold">{label}</h3>
            <p className="text-[10px]">{value}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setShowAddCollabModal(true)}
            className="btn btn-warning"
          >
            Add Collab
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              Cookies.set("repo_id", value, { expires: 10 });
              Cookies.set("repo_name", label, { expires: 10 });
              router.push("/codespace");
              console.log(value);
            }}
          >
            CodeSpace
          </button>
        </div>
      </div>

      {/* Add Collaborator Modal */}
      {showAddCollabModal && (
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
                <span>New Collaborator Added Successfully!</span>
              </div>
            ) : (
              ""
            )}
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
                onClick={handleAddCollaborator}
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
