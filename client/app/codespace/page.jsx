"use client"

import React, {useEffect} from 'react'
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
  useEffect(() => {
    socket = io({
      path: "/api/socket",
    });
    return () => socket.disconnect();
  }, []);

  return (
    <PanelGroup direction="horizontal">
      <Panel defaultSize={15} minSize={10}>
        <FileTree 
          paths={["F1/F2/f3", "F1/f8", "F3/F4/f5", "F3/F4/f6", "F3/F7/f8", "F9/f10", "F11/F12/f13", "F11/F12/f14", "F11/F15/f16", "F11/F15/f17"]}
          socket={socket}
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