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

export const buildFileTree = (paths) => {
    const blocks = {};
    const sortedPaths = [...paths].sort((a, b) => a.path.localeCompare(b.path));

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

    return blocks;
};
