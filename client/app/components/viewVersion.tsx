"use client";

import React, { useState, useEffect } from "react";
import getVersionAction from "@/actions/getVersions";
import readVersionAction from "@/actions/readVersion";
import dynamic from "next/dynamic";
import { FaHistory, FaTimes, FaEye, FaUndo, FaSpinner } from "react-icons/fa";

// Dynamically import the DisplayFileContent component to avoid SSR issues
const DisplayFileContent = dynamic(
  () => import("../display-file-content/page"),
  {
    loading: () => <p>Loading file content...</p>,
    ssr: false,
  },
);

// A reusable, modern modal component
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl m-4 transform transition-transform scale-100">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
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

const VersionPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showFileContent, setShowFileContent] = useState(false);
  const [fileData, setFileData] = useState({
    content: "",
    fileName: "",
    path: "",
  });

  const toggleModal = async () => {
    if (!isModalOpen) {
      setIsLoading(true);
      setError(null);
      setIsModalOpen(true);
      try {
        const { success, versions: fetchedVersions } = await getVersionAction();
        if (success) {
          setVersions(fetchedVersions);
        } else {
          setError("Failed to fetch version history.");
        }
      } catch (err) {
        setError("An error occurred while fetching versions.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsModalOpen(false);
      setSelectedVersion(null);
    }
  };

  const handleRowClick = (version: number) => {
    setSelectedVersion(version);
  };

  const handleReadOnly = async () => {
    if (selectedVersion === null) return;
    try {
      const { success, data } = await readVersionAction(selectedVersion);
      if (success && data) {
        setFileData({
          content: data.content || "",
          fileName: data.path?.split("/").pop() || "Untitled",
          path: data.path || "",
        });
        setShowFileContent(true);
      } else {
        alert("Could not load file content for this version.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred while loading file content.");
    }
  };

  const handleRevert = async () => {
    if (selectedVersion === null) return;
    try {
      const { success, data } = await readVersionAction(selectedVersion);
      if (success && data) {
        window.dispatchEvent(
          new CustomEvent("revert-version", {
            detail: {
              path: data.path,
              content: data.content,
            },
          }),
        );
        alert(`Reverted to version ${selectedVersion}.`);
        toggleModal();
      } else {
        alert("Failed to revert to this version.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred during the revert process.");
    }
  };

  return (
    <>
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={toggleModal}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
        >
          <FaHistory />
          Commit History
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={toggleModal} title="Commit History">
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : versions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No commit history found for this repository.
            </p>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-50 dark:bg-gray-700 sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-semibold">Version</th>
                  <th className="px-6 py-3 font-semibold">Commit Message</th>
                  <th className="px-6 py-3 font-semibold">Author</th>
                </tr>
              </thead>
              <tbody>
                {versions.map((row) => (
                  <tr
                    key={row.version}
                    className={`border-b dark:border-gray-700 cursor-pointer transition-colors ${
                      selectedVersion === row.version
                        ? "bg-blue-100 dark:bg-blue-900/50"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                    onClick={() => handleRowClick(row.version)}
                  >
                    <td className="px-6 py-4">{row.version}</td>
                    <td className="px-6 py-4">{row.commit}</td>
                    <td className="px-6 py-4">{row.uid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {selectedVersion !== null && (
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={handleReadOnly}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md font-medium dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              <FaEye />
              Read Only
            </button>
            <button
              onClick={handleRevert}
              className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md font-medium dark:bg-red-500 dark:hover:bg-red-600"
            >
              <FaUndo />
              Revert
            </button>
          </div>
        )}
      </Modal>

      {showFileContent && (
        <Modal
          isOpen={showFileContent}
          onClose={() => setShowFileContent(false)}
          title={`Viewing: ${fileData.fileName} (v${selectedVersion})`}
        >
          <div className="max-h-[70vh] overflow-auto rounded-lg">
            <DisplayFileContent
              onClose={() => setShowFileContent(false)}
              version={selectedVersion || 0}
              isVersionView={true}
              fileContent={fileData.content}
              fileName={fileData.fileName}
              filePath={fileData.path}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default VersionPage;
