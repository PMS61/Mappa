"use client";

import React, { useState } from "react";
import getVersionAction from "@/actions/getVersions";
import readVersionAction from "@/actions/readVersion";
const VersionPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReadOnlyModalOpen, setIsReadOnlyModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [inpData, setInpData] = useState([]);
  const toggleModal = async (e) => {
    e.preventDefault();
    setIsModalOpen(!isModalOpen);
    const { success, versions } = await getVersionAction();
    setInpData(versions);
    if (!success) {
      return <div>Error: {success}</div>;
    }
  };

  const toggleReadOnlyModal = () => {
    setIsReadOnlyModalOpen(!isReadOnlyModalOpen);
  };
  const dummyData = [
    { version: "1.0.0", description: "Initial release", username: "admin" },
    {
      version: "1.1.0",
      description: "Added new features",
      username: "developer",
    },
    { version: "1.2.0", description: "Bug fixes", username: "tester" },
  ];
  const [getVer, setVer] = useState();
  const handleRowClick = (index, version) => {
    setVer(version);
    setSelectedRow(index);
  };

  const [readVer, setReadVer] = useState({});
  const handleReadOnly = async () => {
    setIsModalOpen(false);
    setIsReadOnlyModalOpen(true);
    try {
      const { success, data } = await readVersionAction(getVer);
      if (success) {
        console.log(data);
        setReadVer(data);
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

  return (
    <div className="absolute bottom-5 left-5">
      <button
        onClick={toggleModal}
        className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Commit History
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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

      {isReadOnlyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg dark:bg-gray-800">
            <h2 className="text-2xl dark:text-white font-bold mb-4">
              Read Only Version Details
            </h2>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Path:</strong> {readVer?.path}
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              <strong>Content:</strong>
              <pre className="whitespace-pre-wrap">{readVer?.content}</pre>
            </p>
            <button
              onClick={toggleReadOnlyModal}
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionPage;
