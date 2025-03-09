"use client"

import React, { useState, useEffect } from "react";
import CreateFileModal from "./CreateFileModal";
import TreeView from "./components/TreeView";
import { createFile } from "./utils/fileUtils";
import { createFolder } from "./folderUtils";

export default function FileTree({ paths, room, repoName, addfile }) {
    const [localPaths, setLocalPaths] = useState(paths);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState('');
    const [newFolders, setNewFolders] = useState([]);

    useEffect(() => {
        if (paths.length > 0) {
            const mergedPaths = [...paths, ...newFolders];
            setLocalPaths(mergedPaths);
        } else {
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
        createFolder(path, folderName, localPaths, setLocalPaths, setNewFolders, room);
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
                repoName={repoName}
            />
            <CreateFileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(fileName) => createFile(room, currentPath, fileName, localPaths, setLocalPaths)}
            />
        </>
    );
}
