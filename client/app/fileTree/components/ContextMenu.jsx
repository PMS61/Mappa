import React from 'react';

const ContextMenu = ({
    contextMenu,
    handleCreateFileClick,
    handleCreateFolderClick,
    handleUploadFileClick,
    handleUploadFolderClick,
    handleClose,
}) => {
    if (!contextMenu) {
        return null;
    }

    const { mouseX, mouseY, path, isFile } = contextMenu;

    const menuStyle = {
        top: mouseY,
        left: mouseX,
    };

    return (
        <div
            className="context-menu fixed bg-white dark:bg-gray-700 shadow-lg rounded-md py-1 z-50 border border-gray-200 dark:border-gray-600"
            style={menuStyle}
            onMouseLeave={handleClose}
        >
            {!isFile && (
                <>
                    <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => {
                            handleCreateFileClick(path);
                            handleClose();
                        }}
                    >
                        Create New File
                    </button>
                    <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => {
                            handleCreateFolderClick(path);
                            handleClose();
                        }}
                    >
                        Create New Folder
                    </button>
                    <hr className="border-gray-200 dark:border-gray-600 my-1" />
                    <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => {
                            handleUploadFileClick(path);
                            handleClose();
                        }}
                    >
                        Upload File
                    </button>
                    <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => {
                            handleUploadFolderClick(path);
                            handleClose();
                        }}
                    >
                        Upload Folder
                    </button>
                </>
            )}
            {/* Add other context menu options here if needed for files */}
        </div>
    );
};

export default ContextMenu;
