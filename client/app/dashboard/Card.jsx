import React from "react";
import { FaFolder, FaUsers, FaTrashAlt, FaArrowRight } from "react-icons/fa";

const Card = ({
  index,
  label,
  value,
  onAddCollaborator,
  onDeleteRepo,
  onOpen,
}) => {
  return (
    <div
      style={{ animationDelay: `${index * 0.1}s` }}
      className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 animate-fadeIn flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center min-w-0">
            <FaFolder className="text-blue-500 dark:text-blue-400 text-3xl mr-4 flex-shrink-0" />
            <div className="min-w-0">
              <h3
                className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate"
                title={label}
              >
                {label}
              </h3>
              <p
                className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all"
                title={value}
              >
                {value}
              </p>
            </div>
          </div>
          {onDeleteRepo && (
            <button
              onClick={onDeleteRepo}
              className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-2"
              aria-label="Delete Repository"
            >
              <FaTrashAlt />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {onAddCollaborator && (
          <button
            onClick={onAddCollaborator}
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label="Add Collaborator"
          >
            <FaUsers />
            <span>Collaborators</span>
          </button>
        )}
        {onOpen && (
          <button
            onClick={onOpen}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            aria-label="Open Codespace"
          >
            <span>Open</span>
            <FaArrowRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
