"use client";

import React from "react";
import { FaFileCode, FaFolderOpen, FaPlusSquare } from "react-icons/fa";

const Placeholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
      <div className="text-center p-8">
        <FaFileCode className="mx-auto text-6xl text-gray-300 dark:text-gray-600 mb-6" />
        <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
          Welcome to Your Codespace
        </h1>
        <p className="max-w-md mx-auto mb-8">
          Select a file from the tree on the left to start editing, or create a
          new file to begin your next masterpiece.
        </p>
        <div className="flex justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <FaFolderOpen className="text-blue-500" />
            <span>Open a file</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPlusSquare className="text-green-500" />
            <span>Create a new file</span>
          </div>
        </div>
      </div>
      <footer className="absolute bottom-4 text-xs text-gray-400">
        <p>Mappa - Collaborative IDE</p>
      </footer>
    </div>
  );
};

export default Placeholder;
