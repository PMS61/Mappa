"use client";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import FileTree from "../fileTree/page";
import Editor from "../editor/page";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CommentsPage from "../comments/page";
import Placeholder from "../placeholder/page";
import VersionPage from "../components/viewVersion";

const Codespace = () => {
  const [room, setRoom] = useState("default-room");
  const [repoName, setRepoName] = useState("default-repo");
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    const repo_id = Cookies.get("repo_id");
    const repo_name = Cookies.get("repo_name");

    if (repo_id && repo_name) {
      setRoom(repo_id);
      setRepoName(repo_name);
    }
  }, []);

  const handleSetActiveTab = (tabId) => {
    setActiveTab(tabId);
  };

  const handleSetTabs = (newTabs) => {
    setTabs(newTabs);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <PanelGroup direction="horizontal" className="flex-grow">
        <Panel defaultSize={15} minSize={10} className="flex flex-col">
          <FileTree
            room={room}
            repoName={repoName}
            tabs={tabs}
            setTabs={handleSetTabs}
            setActiveTab={handleSetActiveTab}
          />
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors duration-200 cursor-col-resize" />

        <Panel defaultSize={60} minSize={30} className="flex flex-col">
          {tabs.length === 0 ? (
            <Placeholder />
          ) : (
            <Editor
              tabs={tabs}
              setTabs={handleSetTabs}
              activeTab={activeTab}
              setActiveTab={handleSetActiveTab}
            />
          )}
        </Panel>

        <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors duration-200 cursor-col-resize" />

        <Panel defaultSize={25} minSize={15} className="flex flex-col">
          <CommentsPage roomId={room} />
        </Panel>
      </PanelGroup>
      <VersionPage />
    </div>
  );
};

export default Codespace;
