"use client";

import { useState } from "react";
import {
  FaFolder,
  FaFolderOpen,
  FaFile,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
import { buildTree } from "../fileTree/arrtotree";

interface TreeNode {
  name: string;
  children?: TreeNode[];
  roomId?: string;
}

interface SidebarProps {
  onFileSelect?: (path: string) => void;
}

const Sidebar = ({ onFileSelect }: SidebarProps) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  // Example files structure - replace with your actual files
  const files = [
    "src/components/Button.tsx",
    "src/components/Input.tsx",
    "src/pages/index.tsx",
    "src/utils/helpers.ts",
    "public/styles/main.css",
  ];

  const fileTree = buildTree(files);

  const toggleFolder = (path: string) => {
    setExpanded((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const renderNode = (node: TreeNode, path: string = "") => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const isFolder = node.children && node.children.length > 0;
    const isExpanded = expanded[currentPath];

    return (
      <div key={currentPath}>
        <div
          className={`flex items-center px-2 py-1 hover:bg-gray-700 cursor-pointer ${
            isFolder ? "font-medium" : ""
          }`}
          onClick={() => {
            if (isFolder) {
              toggleFolder(currentPath);
            } else if (onFileSelect) {
              onFileSelect(currentPath);
            }
          }}
        >
          <span className="mr-2">
            {isFolder ? (
              isExpanded ? (
                <FaChevronDown className="inline w-3 h-3" />
              ) : (
                <FaChevronRight className="inline w-3 h-3" />
              )
            ) : null}
          </span>
          <span className="mr-2">
            {isFolder ? (
              isExpanded ? (
                <FaFolderOpen className="text-yellow-400" />
              ) : (
                <FaFolder className="text-yellow-400" />
              )
            ) : (
              <FaFile className="text-gray-400" />
            )}
          </span>
          <span className="text-sm">{node.name}</span>
        </div>
        {isFolder && isExpanded && (
          <div className="ml-4">
            {node.children?.map((child) => renderNode(child, currentPath))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-gray-800 text-gray-100 h-screen overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Files</h2>
      </div>
      <div className="p-2">{fileTree.map((node) => renderNode(node))}</div>
    </div>
  );
};

export default Sidebar;
