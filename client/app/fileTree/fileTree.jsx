"use client"

import React, { useState, useEffect, useRef } from "react"; // Import useRef
import CreateFileModal from "./CreateFileModal";
import TreeView from "./components/TreeView";
import { createFile, uploadFile, uploadFolder } from "./utils/fileUtils"; // Import new upload functions
import { createFolder } from "./folderUtils"; // Ensure createFolder is imported

export default function FileTree({ paths, room, repoName, addfile }) {
    const [localPaths, setLocalPaths] = useState(paths);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState('');
    const [newFolders, setNewFolders] = useState([]);

    // Refs for hidden file inputs
    const fileInputRef = useRef(null);
    const folderInputRef = useRef(null);

    useEffect(() => {
        if (paths.length > 0) {
            const mergedPaths = [...paths, ...newFolders];
            setLocalPaths(mergedPaths);
        } else {
            // Initialize with a hidden file for the root repo if no paths exist
            const temp = [{"room_id": Date.now().toString(), "path": `${repoName}/.hidden`}];
            setLocalPaths(temp);
        }
    }, [paths, repoName, room, newFolders]);

    const handleCreateFileClick = (path) => {
        setCurrentPath(path);
        setIsModalOpen(true);
    };

    const handleCreateFolderClick = (path) => {
        const folderName = prompt("Enter folder name");
        // Pass 'room' to createFolder
        createFolder(room, path, folderName, localPaths, setLocalPaths, setNewFolders);
    };

    const handleUploadFileClick = (path) => {
        setCurrentPath(path); // Set the path where the file will be uploaded
        fileInputRef.current.click(); // Trigger the hidden file input
    };

    const handleUploadFolderClick = (path) => {
        setCurrentPath(path); // Set the path where the folder will be uploaded
        folderInputRef.current.click(); // Trigger the hidden folder input
    };

    const handleFileSelected = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const success = await uploadFile(room, currentPath, file);
            if (success) {
                // After successful upload, refresh the file tree
                // This assumes page.jsx's getPaths will pick up the new file
                // For immediate feedback, you might want to add it to localPaths
                // but a full refresh from backend is more robust.
                window.location.reload(); // A simple way to refresh for now
            }
        }
        event.target.value = null; // Clear the input so same file can be selected again
    };

    const handleFolderSelected = async (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const success = await uploadFolder(room, currentPath, files);
            if (success) {
                // After successful upload, refresh the file tree
                window.location.reload(); // A simple way to refresh for now
            }
        }
        event.target.value = null; // Clear the input
    };

    const handleFileClick = (roomId) => {
        const file = localPaths.find(path => path.room_id === roomId);
        if (file) {
            document.cookie = `file_${roomId}=${encodeURIComponent(file.path)}; path=/; max-age=31536000`;
            const filename = file.path.split('/').pop();
            if (filename.slice(-3) === "dwg") {
                window.open(`/drawing-board/${roomId}`, "_blank", "noopener,noreferrer");
            }
            else if (filename.slice(-3) === "doc"){
                window.open(`/text-editor/${roomId}`, "_blank", "noopener,noreferrer");
            } else {
                addfile({ id: roomId, name: filename });
            }
        }
    };

    return (
        <>
            <TreeView 
                paths={localPaths} 
                handleCreateFileClick={handleCreateFileClick} 
                handleCreateFolderClick={handleCreateFolderClick} 
                handleFileClick={handleFileClick}
                handleUploadFileClick={handleUploadFileClick} // Pass new handler
                handleUploadFolderClick={handleUploadFolderClick} // Pass new handler
                repoName={repoName}
            />
            <CreateFileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(fileName) => createFile(room, currentPath, fileName, localPaths, setLocalPaths)}
            />
            {/* Hidden file input for single file upload */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelected}
                style={{ display: 'none' }}
            />
            {/* Hidden file input for folder upload */}
            <input
                type="file"
                ref={folderInputRef}
                onChange={handleFolderSelected}
                style={{ display: 'none' }}
                webkitdirectory="" // This attribute allows selecting folders
                directory="" // For broader compatibility
            />
        </>
    );
}
