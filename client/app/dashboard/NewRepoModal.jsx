import React, { useState } from 'react';
import createRepoAction from '@/actions/newRepo';
import { FaTimes } from "react-icons/fa";

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

const NewRepoModal = ({ isOpen, onClose, onRepoCreated }) => {
  const [newRepoName, setNewRepoName] = useState('');
  const [error, setError] = useState('');

  const handleAddRepo = async (e) => {
    e.preventDefault();
    if (!newRepoName.trim()) return;
    try {
      const result = await createRepoAction(newRepoName);
      if (result.success) {
        setNewRepoName('');
        onRepoCreated();
        onClose();
      } else {
        setError(result.error || 'Failed to create repository.');
      }
    } catch (e) {
      setError('An unexpected error occurred.');
      console.log(e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
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
  );
};

export default NewRepoModal;