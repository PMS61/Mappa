export async function createFolder(room, parentPath, folderName, localPaths, setLocalPaths, setNewFolders) {
  if (!folderName) return;

  const newPath = parentPath 
    ? `${parentPath}/${folderName}` 
    : folderName;
  
  // Call backend to create the folder
  const res = await fetch('http://localhost:8000/room/create-new-folder', { // **Backend Endpoint Needed**
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "repo_id": room, "path": newPath }),
  });

  if (res.status === 200) {
      console.log('Folder created successfully on backend');
      // Add a hidden file to represent the folder in the frontend tree
      const hiddenFilePath = `${newPath}/.hidden`;
      const newPathObj = {
        room_id: Date.now().toString(), // A temporary ID for frontend representation
        path: hiddenFilePath
      };
      const updatedPaths = [...localPaths, newPathObj];
      setLocalPaths(updatedPaths);
      setNewFolders(prev => [...prev, newPathObj]);
  } else {
      console.error('Failed to create folder on backend');
  }
}