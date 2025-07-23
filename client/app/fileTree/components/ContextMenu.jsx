import React from "react";

const ContextMenu = ({
  contextMenu,
  handleCreateFileClick,
  handleCreateFolderClick,
  handleUploadFileClick,
  handleClose,
}) => {
  if (!contextMenu) {
    return null;
  }

  const { mouseX, mouseY, path, isFile } = contextMenu;

  const menuStyle = {
    top: mouseY,
    left: mouseX,
    minWidth: 160,
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
    transition: "opacity 0.15s",
  };

  return (
    <div
      className="context-menu fixed bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 z-50 border border-gray-200 dark:border-gray-700"
      style={menuStyle}
      onMouseLeave={handleClose}
    >
      {!isFile && (
        <>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900 transition"
            title="Create a new file in this folder"
            onClick={() => {
              handleCreateFileClick(path);
              handleClose();
            }}
          >
            📄 Create New File
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900 transition"
            title="Create a new folder"
            onClick={() => {
              handleCreateFolderClick(path);
              handleClose();
            }}
          >
            📁 Create New Folder
          </button>
        </>
      )}
    </div>
  );
};

export default ContextMenu;
