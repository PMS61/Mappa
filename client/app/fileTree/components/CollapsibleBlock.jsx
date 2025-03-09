import { FaFolder, FaFolderOpen, FaFile, FaDraftingCompass, FaFileWord, FaPython, FaJs } from "react-icons/fa";

const CollapsibleBlock = ({ name, isFile, depth, onToggle, isCollapsed, onContextMenu }) => {
    if (name == ".hidden") return null;

    const getFileIcon = (fileName) => {
        if (fileName.toLowerCase().endsWith('.dwg')) {
            return <FaDraftingCompass className="mr-3" />;
        } else if (fileName.toLowerCase().endsWith('.doc')) {
            return <FaFileWord className="mr-3" />;
        } else if (fileName.toLowerCase().endsWith('.py')) {
            return <FaPython className="mr-3" />;
        } else if (fileName.toLowerCase().endsWith('.js')) {
            return <FaJs className="mr-3" />;
        }
        return <FaFile className="mr-3" />;
    };

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
                    getFileIcon(name)
                ) : (
                    isCollapsed ? <FaFolder className="mr-3" /> : <FaFolderOpen className="mr-3" />
                )}
                <span className="font-semibold select-none">{name}</span>
            </div>
        </div>
    );
};

export default CollapsibleBlock;
