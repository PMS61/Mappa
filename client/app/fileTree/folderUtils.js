export function createFolder(parentPath, folderName, localPaths, setLocalPaths, setNewFolders) {
  if (!folderName) return;
  const newPath = parentPath 
    ? `${parentPath}/${folderName}/.hidden` 
    : `${folderName}/.hidden`;
  const newPathObj = {
    room_id: Date.now().toString(),
    path: newPath
  };
  const updatedPaths = [...localPaths, newPathObj];
  setLocalPaths(updatedPaths);
  setNewFolders(prev => [...prev, newPathObj]);
}