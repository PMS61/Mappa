"use client";

import React, { useState } from "react";
import getVersionAction from "@/actions/getVersions";
import readVersionAction from "@/actions/readVersion";
import dynamic from "next/dynamic";

// Import the DisplayFileContent component dynamically to avoid SSR issues with browser-specific features
const DisplayFileContent = dynamic(
  () => import("../display-file-content/page"),
  { ssr: false }
);

const VersionPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [inpData, setInpData] = useState([]);
  const [showFileContent, setShowFileContent] = useState(false);
  const [fileData, setFileData] = useState({
    content: "",
    fileName: "",
    path: ""
  });
  
  const toggleModal = async (e) => {
    e.preventDefault();
    setIsModalOpen(!isModalOpen);
    const { success, versions } = await getVersionAction();
    setInpData(versions);
    if (!success) {
      return <div>Error: {success}</div>;
    }
  };

  const [getVer, setVer] = useState();
  const handleRowClick = (index, version) => {
    setVer(version);
    setSelectedRow(index);
  };

  const handleReadOnly = async () => {
    try {
      const { success, data } = await readVersionAction(getVer);
      if (success) {
        // Store the file data in component state
        setFileData({
          content: data.content || "",
          fileName: data.path?.split('/').pop() || "Untitled",
          path: data.path || ""
        });
        
        // Close the modal and show the file content display
        setIsModalOpen(false);
        setShowFileContent(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleRevert = async () => {
    try {
      const { success, data } = await readVersionAction(getVer);
      if (success) {
        window.dispatchEvent(
          new CustomEvent("revert-version", {
            detail: {
              path: data?.path,
              content: data?.content,
            },
          })
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleCloseFileContent = () => {
    setShowFileContent(false);
    setFileData({ content: "", fileName: "", path: "" });
    setIsModalOpen(true);
  };

  return (
    <div className="absolute bottom-5 left-5">
      <button
        onClick={toggleModal}
        className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Commit History
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg dark:bg-gray-800">
            <h2 className="text-2xl dark:text-white font-bold mb-4">
              Version Information
            </h2>
            <table className="min-w-full bg-white dark:bg-gray-800 text-center">
              <thead>
                <tr>
                  <th className="py-2 px-4 bg-yellow-600 text-white dark:bg-blue-500">
                    Version
                  </th>
                  <th className="py-2 px-4 bg-yellow-600 text-white dark:bg-blue-500">
                    Commit
                  </th>
                  <th className="py-2 px-4 bg-yellow-600 text-white dark:bg-blue-500">
                    Username
                  </th>
                </tr>
              </thead>
              <tbody>
                {inpData &&
                  inpData.map((row, index) => (
                    <tr
                      key={index}
                      className={`border-b dark:border-gray-700 cursor-pointer ${selectedRow === index ? "bg-yellow-200 dark:bg-gray-700" : ""}`}
                      onClick={() => handleRowClick(index, row?.version)}
                    >
                      <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                        {row?.version}
                      </td>
                      <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                        {row?.commit}
                      </td>
                      <td className="py-2 px-4 text-gray-800 dark:text-gray-200">
                        {row?.uid}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {selectedRow !== null && (
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  onClick={handleReadOnly}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Read Only
                </button>
                <button
                  onClick={handleRevert}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                >
                  Revert
                </button>
              </div>
            )}
            <button
              onClick={toggleModal}
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showFileContent && (
        <div className="fixed inset-0 z-50">
          <DisplayFileContent 
            onClose={handleCloseFileContent} 
            version={getVer} 
            isVersionView={true}
            fileContent={fileData.content}
            fileName={fileData.fileName}
            filePath={fileData.path}
          />
        </div>
      )}
    </div>
  );
};

export default VersionPage;
