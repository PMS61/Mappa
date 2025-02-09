"use client"
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import FileTree from '../fileTree/page'
import Chat from '../chat/page'
import Editor from '../editor/page'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"

const ResizeHandle = () => {
  return <PanelResizeHandle className="panel-resize-handle" />;
};

const Codespace = () => {
  const [room, setRoom] = useState('default-room'); 
  const [repoName, setRepoName] = useState('default-repo');

  const [tabs, setTabs] = useState([
    { id: "hello", name: "index.js" },
    { id: "2", name: "styles.css" },
  ]);
  const [active_state, setActiveState] = useState("hello");

  useEffect(() => {
    const repo_id = Cookies.get('repo_id');
    const repo_name = Cookies.get('repo_name');
    console.log('repo_id', repo_id);
    console.log('repo_name', repo_name);
    
    if (repo_id && repo_name) {
      setRoom(repo_id);
      setRepoName(repo_name);
    }
  }, []);

  return (
    <PanelGroup direction="horizontal">
      <Panel defaultSize={15} minSize={10}>
        <FileTree 
          room={room}
          repoName={repoName}
        />
      </Panel>
      
      <ResizeHandle />
      
      <Panel defaultSize={60} minSize={30}>
        <Editor 
          tabs={tabs}
          setTabs={setTabs}
          activeTab={active_state}
          setActiveTab={setActiveState}
        />
      </Panel>
      
      <ResizeHandle />
      
      <Panel defaultSize={25} minSize={15}>
        <Chat />
      </Panel>
    </PanelGroup>
  );
}

export default Codespace