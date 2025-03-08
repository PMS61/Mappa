import { FaFolder, FaFolderOpen, FaFile } from "react-icons/fa";

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

export default CollapsibleBlock;
