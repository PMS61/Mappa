export const getRoomId = async (room, path) => {
    const res = await fetch('http://localhost:8000/room/create-new-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "repo_id": room, "path": path }),
    });

    if (res.status === 200) {
        const data = await res.json();
        return data.room_id;
    }
};

export const createFile = async (room, parentPath, fileName, localPaths, setLocalPaths) => {
    const newPath = parentPath ? `${parentPath}/${fileName}` : fileName;
    const roomId = await getRoomId(room, newPath);

    const newPathObj = {
        room_id: roomId,
        path: newPath
    };
    const updatedPaths = [...localPaths, newPathObj];
    setLocalPaths(updatedPaths);

    if (!(fileName.slice(-3) === "dwg" || fileName.slice(-3) === "doc")) {
        window.dispatchEvent(new CustomEvent('add-tab', { detail: { id: roomId, name: fileName } }));
    }
    return roomId;
};

export const uploadFile = async (room, parentPath, file) => {
    const formData = new FormData();
    formData.append('repo_id', room);
    formData.append('path', parentPath); // The backend should handle appending filename to path
    formData.append('file', file);

    const res = await fetch('http://localhost:8000/room/upload-file', { // **Backend Endpoint Needed**
        method: 'POST',
        body: formData,
    });

    if (res.status === 200) {
        console.log('File uploaded successfully');
        return true;
    } else {
        console.error('File upload failed');
        return false;
    }
};

export const uploadFolder = async (room, parentPath, files) => {
    const formData = new FormData();
    formData.append('repo_id', room);
    formData.append('parent_path', parentPath); // Base path for the uploaded folder

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Use webkitRelativePath to maintain folder structure
        formData.append('files', file, file.webkitRelativePath);
    }

    const res = await fetch('http://localhost:8000/room/upload-folder', { // **Backend Endpoint Needed**
        method: 'POST',
        body: formData,
    });

    if (res.status === 200) {
        console.log('Folder uploaded successfully');
        return true;
    } else {
        console.error('Folder upload failed');
        return false;
    }
};

export const buildFileTree = (paths) => {
    const blocks = {};
    const sortedPaths = [...paths].sort((a, b) => a.path.localeCompare(b.path));

    sortedPaths.forEach(obj => {
        const parts = obj.path.split('/');
        let current = blocks;

        parts.forEach((part, index) => {
            if (!current[part]) {
                // For folders, roomId might not be present or relevant, so default to null
                current[part] = { children: {}, isFile: false, roomId: obj.room_id || null };
            }
            if (index === parts.length - 1) {
                current[part].isFile = true;
                current[part].roomId = obj.room_id; // Ensure roomId is set for the actual file
            }
            current = current[part].children;
        });
    });

    return blocks;
};
