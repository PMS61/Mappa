"use client"

import React, { useEffect, useState } from 'react'
import FileTree from '../fileTree/page'
import Chat from '../chat/page'
import Editor from '../editor/page'
import io from "socket.io-client"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"

let socket;

const ResizeHandle = () => {
  return <PanelResizeHandle className="panel-resize-handle" />;
};

const Codespace = () => {
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket = io({
      path: "/api/socket",
    });

    socket.on('message', (message) => {
      console.log(message);
    });

    return () => socket.disconnect();
  }, []);

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (room) {
      socket.emit('joinRoom', room);
      setJoined(true);
    }
  };

  if (!joined) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <form onSubmit={handleJoinRoom} className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Enter room code"
            className="w-full p-2 mb-4 border rounded dark:bg-gray-600 dark:text-white"
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Join Room
          </button>
        </form>
      </div>
    );
  }

  return (
    <PanelGroup direction="horizontal">
      <Panel defaultSize={15} minSize={10}>
        <FileTree 
          paths={["F1/F2/f3", "F1/f8", "F3/F4/f5", "F3/F4/f6", "F3/F7/f8", "F9/f10", "F11/F12/f13", "F11/F12/f14", "F11/F15/f16", "F11/F15/f17"]}
          socket={socket}
          room={room}
        />
      </Panel>
      
      <ResizeHandle />
      
      <Panel defaultSize={60} minSize={30}>
        <Editor />
      </Panel>
      
      <ResizeHandle />
      
      <Panel defaultSize={25} minSize={15}>
        <Chat socket={socket} />
      </Panel>
    </PanelGroup>
  );
}

export default Codespace