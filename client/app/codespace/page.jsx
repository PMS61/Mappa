"use client";
import Cookies from "js-cookie";
import VersionPage from "../components/viewVersion";
import React, { useEffect, useState } from "react";
import FileTree from "../fileTree/page";
// import Chat from "../chat/page";
import Editor from "../editor/page";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CommentsPage from "../comments/page";
import Placeholder from "../placeholder/page";

const ResizeHandle = () => {
  return <PanelResizeHandle className="panel-resize-handle" />;
};

const Codespace = () => {
  const [room, setRoom] = useState("default-room");
  const [repoName, setRepoName] = useState("default-repo");

  const [tabs, setTabs] = useState([
    // { id: "welcome", name: "Welcome!!" },
  ]);
  const [active_state, setActiveState] = useState("welcome");

  useEffect(() => {
    const repo_id = Cookies.get("repo_id");
    const repo_name = Cookies.get("repo_name");
    console.log("repo_id", repo_id);
    console.log("repo_name", repo_name);

    if (repo_id && repo_name) {
      setRoom(repo_id);
      setRepoName(repo_name);
    }
  }, []);

  return (
    <PanelGroup direction="horizontal" className="relative">
      <Panel defaultSize={15} minSize={10}>
        <FileTree 
          room={room} 
          repoName={repoName}
          tabs={tabs}
          setTabs={setTabs}
          setActiveTab={setActiveState}  
        />
      </Panel>
      <ResizeHandle />

      <Panel defaultSize={60} minSize={30}>
        {tabs.length === 0 ? 
        (
          <Placeholder />
        )
        : 
        (
          <Editor 
            tabs={tabs}
            setTabs={setTabs}
            activeTab={active_state}
            setActiveTab={setActiveState}
          />
        )}
      </Panel>

      <ResizeHandle />

      <Panel defaultSize={25} minSize={15}>
        <CommentsPage
          roomId={room}
        />
      </Panel>
      {/* <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-blue-600 absolute left-6 bottom-20">
        Merge Conflicts
      </button> */}
      <VersionPage />
    </PanelGroup>
  );
};

export default Codespace;
