const ContextMenu = ({ contextMenu, handleCreateFileClick, handleCreateFolderClick, handleClose }) => {
    if (!contextMenu) return null;

    return (
        <div
            className="fixed context-menu"
            style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-white dark:bg-gray-700 shadow-lg rounded-md p-4">
                <div className="mb-4 text-gray-800 dark:text-gray-200">
                    Path: {contextMenu.path}
                </div>
                {!contextMenu.isFile && (
                    <>
                        <button 
                            className="block text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-md mb-2"
                            onClick={() => {
                                handleCreateFileClick(contextMenu.path);
                                handleClose();
                            }}
                        >
                            Create File
                        </button>
                        <button 
                            className="block text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-md mb-2"
                            onClick={() => {
                                handleCreateFolderClick(contextMenu.path);
                                handleClose();
                            }}
                        >
                            Create Folder
                        </button>
                    </>
                )}
                <button className="block text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-md">
                    Delete
                </button>
            </div>
        </div>
    );
};

export default ContextMenu;
