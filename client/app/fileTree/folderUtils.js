
export function createFolder(parentPath, folderName, localPaths, setLocalPaths, socket, room) {
  if (!folderName) return;
  const newPath = parentPath 
    ? `${parentPath}/${folderName}/.hidden` 
    : `${folderName}/.hidden`;
  const updatedPaths = [...localPaths, newPath];
  setLocalPaths(updatedPaths);
  socket.emit('send-file-tree', { room, message: updatedPaths });
}