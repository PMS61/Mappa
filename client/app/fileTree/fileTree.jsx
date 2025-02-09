"use client"

import React, { useState, useEffect } from "react";
import { FaFolder, FaFolderOpen, FaFile } from "react-icons/fa";
import CreateFileModal from "./CreateFileModal";
import { createFolder } from "./folderUtils";
import { useRouter } from "next/navigation";

const CollapsibleBlock = ({ name, isFile, depth, onToggle, isCollapsed, onContextMenu }) => {
    if (name == ".hidden") return null;
    return (
        <div 
            className="py-1 px-5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            onContextMenu={onContextMenu}
            style={{ marginLeft: depth * 12 }}
        >
            <div 
                className="flex items-center cursor-pointer text-gray-800 dark:text-gray-200"
                onClick={onToggle}
            >
                {isFile ? (
                    <FaFile className="mr-3" />
                ) : (
                    isCollapsed ? <FaFolder className="mr-3" /> : <FaFolderOpen className="mr-3" />
                )}
                <span className="font-semibold select-none">{name}</span>
            </div>
        </div>
    );
};

const TreeView = ({ paths, handleCreateFileClick, handleCreateFolderClick, handleFileClick, repoName }) => {
    const [collapsed, setCollapsed] = useState({});
    const [contextMenu, setContextMenu] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenu && !event.target.closest('.context-menu')) {
                setContextMenu(null);
            }
        };

        const handleKeyPress = (event) => {
            if (contextMenu && (event.key === 'Escape' || event.key === 'Enter')) {
                setContextMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [contextMenu]);

    const toggleCollapse = (path) => {
        setCollapsed(prev => ({ ...prev, [path]: !prev[path] }));
    };

    const handleContextMenu = (event, path, isFile) => {
        event.preventDefault();
        setContextMenu({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
            path: path,
            isFile: isFile,
        });
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    const sortedPaths = [...paths].sort((a, b) => a.path.localeCompare(b.path));
    const blocks = {};

    sortedPaths.forEach(obj => {
        const parts = obj.path.split('/');
        let current = blocks;

        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] = { children: {}, isFile: false, roomId: obj.room_id };
            }
            if (index === parts.length - 1) {
                current[part].isFile = true;
            }
            current = current[part].children;
        });
    });

    const renderBlocks = (blocks, depth = 0, parentPath = '') => {
        return Object.keys(blocks).map((key, index) => {
            const path = parentPath ? `${parentPath}/${key}` : key;
            const isCollapsed = collapsed[path];
            return (
                <div key={index}>
                    <CollapsibleBlock 
                        name={key} 
                        isFile={blocks[key].isFile} 
                        depth={depth} 
                        onToggle={() => blocks[key].isFile ? handleFileClick(blocks[key].roomId) : toggleCollapse(path)} 
                        isCollapsed={isCollapsed} 
                        onContextMenu={(e) => handleContextMenu(e, path, blocks[key].isFile)}
                    />
                    {!isCollapsed && !blocks[key].isFile && renderBlocks(blocks[key].children, depth + 1, path)}
                </div>
            );
        });
    };

    const renderContextMenu = () => (
        contextMenu && (
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
        )
    );

    const router = useRouter();

    return (
        <div className="h-full bg-white dark:bg-gray-800 flex flex-col">
            <div 
                className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-md"
                onClick={() => router.push('/dashboard')}
            >
                <h2 className="text-xl font-bold py-2 text-center text-gray-700 dark:text-gray-200 border-b">{repoName}</h2>
            </div>
            <div className="overflow-y-auto flex-1 p-1">
                {renderBlocks(blocks)}
            </div>
            {renderContextMenu()}
        </div>
    );
};

export default function FileTree({ paths, room, repoName, addfile }) {
    console.log(paths);
    console.log(room, repoName);
    const [localPaths, setLocalPaths] = useState(paths);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState('');

    useEffect(() => {
        console.log(paths, repoName, room);
        if (paths.length > 0) setLocalPaths(paths); 
        else {
            const temp = [{"room_id": Date.now().toString(),"path": `${repoName}/.hidden`}]
            console.log(temp);
            setLocalPaths(temp);
        }
    }, [paths, repoName, room]); // Ensure the dependency array includes paths, repoName, and room

    const getRoomId = async (room, path) => {
        const res = await fetch('http://localhost:8000/room/create-new-file', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "repo_id": room, "path": path }),
          })

        if (res.status === 200) {
            const data = await res.json();
            console.log(data);
            return data.room_id;
        }

    };

    const createFile = async (room, parentPath, fileName) => {
        const newPath = parentPath ? `${parentPath}/${fileName}` : fileName;

        const roomId = await getRoomId(room, newPath);

        const newPathObj = {
            room_id: roomId,
            path: newPath
        };
        const updatedPaths = [...localPaths, newPathObj];
        setLocalPaths(updatedPaths);

        // Add the new file to the tabs in the CollaborativeEditor
        window.dispatchEvent(new CustomEvent('add-tab', { detail: { id: roomId, name: fileName } }));
    };

    const handleCreateFileClick = (path) => {
        setCurrentPath(path);
        setIsModalOpen(true);
    };

    const handleCreateFolderClick = (path) => {
        const folderName = prompt("Enter folder name");
        createFolder(path, folderName, localPaths, setLocalPaths, null, room);
    };

    const handleFileClick = (roomId) => {
        const file = localPaths.find(path => path.room_id === roomId);
        if (file) {
            const filename = file.path.split('/').pop();
            addfile({ id: roomId, name: filename });
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
                onSubmit={(fileName) => createFile(room, currentPath, fileName)}
            />
        </>
    );
}
