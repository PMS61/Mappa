import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CollapsibleBlock from './CollapsibleBlock';
import ContextMenu from './ContextMenu';
import { buildFileTree } from '../utils/fileUtils';

const TreeView = ({ paths, handleCreateFileClick, handleCreateFolderClick, handleFileClick, repoName }) => {
    const [collapsed, setCollapsed] = useState({});
    const [contextMenu, setContextMenu] = useState(null);
    const router = useRouter();

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

    const blocks = buildFileTree(paths);

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
            <ContextMenu 
                contextMenu={contextMenu}
                handleCreateFileClick={handleCreateFileClick}
                handleCreateFolderClick={handleCreateFolderClick}
                handleClose={() => setContextMenu(null)}
            />
        </div>
    );
};

export default TreeView;
