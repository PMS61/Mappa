"use client"

import React from 'react'

import FileTree from '../fileTree/page'
import Chat from '../chat/page'

import io from "socket.io-client";

let socket;

const Codespace = () => {

  useEffect(() => {
    socket = io({
        path: "/api/socket",
    });

    return () => socket.disconnect();
  }, []);

  const joinRoom = () => {
      if (room) {
          socket.emit("joinRoom", room);
      }
  };

  const leaveRoom = () => {
      if (room) {
          socket.emit("leaveRoom", room);
          setRoom(""); // Reset room input
      }
  };``

  return (
    <div>
      <FileTree 
        paths = {["F1/F2/f3", "F1/f8", "F3/F4/f5", "F3/F4/f6", "F3/F7/f8", "F9/f10", "F11/F12/f13", "F11/F12/f14", "F11/F15/f16", "F11/F15/f17"]}
        socket={socket}
      />
      <Chat 
        socket={socket}
      />
    </div>
  )
}

export default Codespace