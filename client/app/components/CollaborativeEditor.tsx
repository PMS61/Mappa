"use client";

import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { useCallback, useEffect, useState, useRef } from "react";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import styles from "./CollaborativeEditor.module.css";
import { Avatars } from "./Avatars";
import { EditorTabs } from "./EditorTabs";
import { CommitModal } from "./CommitModal";
import { createNewRoom } from "../editor/Room";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
const MergeEditor = dynamic(() => import("../merge-editor/page"), { ssr: false });

// Collaborative code editor with file tabs, live cursors, and live avatars
export function CollaborativeEditor({ tabs, setTabs, activeTab, setActiveTab }) {
  const room = useRoom();
  const [element, setElement] = useState<HTMLElement>();
  // const [tabs, setTabs] = useState([
  //   { id: "1", name: "index.js" },
  //   { id: "2", name: "styles.css" },
  // ]);
  // const [activeTab, setActiveTab] = useState("1");
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [isMergeEditorOpen, setIsMergeEditorOpen] = useState(false);

  // Get user info from Liveblocks authentication endpoint
  const userInfo = useSelf((me) => me.info);
  const ydoc = useRef(new Y.Doc()).current; // Use useRef to ensure a single instance

  // Create a map to store ydocs for each tab
  const ydocsRef = useRef<Map<string, Y.Doc>>(new Map());

  // Get or create ydoc for current tab
  const getYDoc = useCallback((tabId: string) => {
    if (!ydocsRef.current.has(tabId)) {
      ydocsRef.current.set(tabId, new Y.Doc());
    }
    return ydocsRef.current.get(tabId)!;
  }, []);

  const handleCommit = async (message: string) => {
    const uid = Cookies.get("username");
    const repoId = Cookies.get("repo_id"); // Get repo_id from cookies
    const activeYDoc = getYDoc(activeTab); // Get the Yjs document for the active tab
    const ytext = activeYDoc.getText("codemirror").toString(); // Get the content from the active Yjs document
    const filePath = Cookies.get(`file_${activeTab}`); // Get the file path from cookies
    console.log("Active Tab ID:", activeTab); // Log active tab ID for debugging
    console.log("Ytext:", ytext); // Log Yjs content for debugging
    console.log("File Path:", filePath); // Log file path for debugging

    // Store ytext in "alpha" cookie after commit
    Cookies.set("alpha", ytext);

    const commitData = {
      repo_id: repoId,
      uid: uid,
      commit: message,
      files: [
        {
          path: filePath,
          content: ytext,
        },
      ],
    };

    console.log("Commit Data:", commitData); // Log commit data for debugging

    try {
      const res = await fetch("http://localhost:8000/version/post-version", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commitData),
      });

      if (res.status === 200) {
        console.log("Commit successful");
        alert("Commit successful!"); // Show alert on successful commit
      } else {
        console.error("Commit failed");
      }
    } catch (e) {
      console.error("Error committing changes:", e);
    }
  };

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    setElement(node);
  }, []);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  // Clean up ydoc when tab is closed
  const handleTabClose = (id: string) => {
    if (tabs.length > 1) {
      const ydoc = ydocsRef.current.get(id);
      if (ydoc) {
        ydoc.destroy();
        ydocsRef.current.delete(id);
      }
      setTabs(tabs.filter((tab) => tab.id !== id));
      if (activeTab === id) {
        setActiveTab(tabs[0].id);
      }
    }
  };

  // Function to switch to the next tab
  const switchToNextTab = useCallback(() => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex].id);
  }, [tabs, activeTab]);

  // Function to switch to the previous tab
  const switchToPreviousTab = useCallback(() => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const previousIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    setActiveTab(tabs[previousIndex].id);
  }, [tabs, activeTab]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle Ctrl + Tab for next tab
      if (event.key === "Tab" && (event.ctrlKey || event.metaKey)) {
        // Prevent browser tab switching
        event.stopPropagation();
        event.preventDefault();

        if (event.shiftKey) {
          switchToPreviousTab();
        } else {
          switchToNextTab();
        }
      }
    };

    // Add event listener with capture phase
    document.addEventListener("keydown", handleKeyDown, { capture: true });

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [switchToNextTab, switchToPreviousTab]);

  // Listen for the add-tab event and update the tabs state accordingly
  useEffect(() => {
    const handleAddTab = (event: CustomEvent) => {
      const { id, name } = event.detail;
      setTabs((prevTabs) => [...prevTabs, { id, name }]);
      setActiveTab(id);
    };

    window.addEventListener("add-tab", handleAddTab);

    return () => {
      window.removeEventListener("add-tab", handleAddTab);
    };
  }, []);

  // Set up Liveblocks Yjs provider and attach CodeMirror editor
  useEffect(() => {
    let provider: LiveblocksYjsProvider;
    let view: EditorView;

    if (!element || !room || !userInfo || !activeTab) {
      return;
    }

    const ydoc = getYDoc(activeTab);

    // Create Yjs provider and document
    provider = new LiveblocksYjsProvider(room as any, ydoc);
    const ytext = ydoc.getText("codemirror");

    // Attach user info to Yjs
    provider.awareness.setLocalStateField("user", {
      name: userInfo.name,
      color: userInfo.color,
      colorLight: userInfo.color + "80",
    });

    // Set up CodeMirror and extensions
    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        javascript(),
        yCollab(ytext, provider.awareness),
        EditorView.domEventHandlers({
          keydown: (event) => {
            // Only prevent Tab when Ctrl/Cmd is pressed
            if (event.key === "Tab" && (event.ctrlKey || event.metaKey)) {
              event.preventDefault();
              return true;
            }
            return false;
          },
        }),
      ],
    });

    // Attach CodeMirror to element
    view = new EditorView({
      state,
      parent: element,
    });

    // Log the initial content of the Yjs document
    console.log("Initial Ytext for active tab:", ytext.toString());

    // Update "beta" cookie whenever the text is edited
    ytext.observe(() => {
      Cookies.set("beta", ytext.toString());
    });

    return () => {
      provider?.destroy();
      view?.destroy();
    };
  }, [element, room, userInfo, activeTab, getYDoc]); // Add getYDoc as dependency

  const handleCreateNewFile = async () => {
    try {
      const newRoomId = await createNewRoom(newFileName);
      setTabs([...tabs, { id: newRoomId, name: newFileName }]);
      setActiveTab(newRoomId);
      setIsNewFileModalOpen(false);
      setNewFileName("");
    } catch (error) {
      console.error("Failed to create new file:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.editorHeader}>
        <div className={styles.headerTop}>
          <EditorTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabClick={handleTabClick}
            onTabClose={handleTabClose}
          />
          <button
            className="btn btn-outline btn-accent"
            onClick={() => setIsCommitModalOpen(true)}
            title="Commit changes"
          >
            Commit
          </button>
        </div>
        <Avatars />
      </div>
      <div className={styles.editorContainer} ref={ref}></div>
      <CommitModal
        isOpen={isCommitModalOpen}
        onClose={() => setIsCommitModalOpen(false)}
        onCommit={handleCommit}
      />
      {isNewFileModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Create New File</h2>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="Enter file name"
            />
            <button onClick={handleCreateNewFile}>Create</button>
            <button onClick={() => setIsNewFileModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
      {isMergeEditorOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <MergeEditor />
            <button onClick={() => setIsMergeEditorOpen(false)}>Close</button>
          </div>
        </div>
      )}
      <button
        className="btn btn-danger"
        onClick={() => setIsMergeEditorOpen(true)}
        title="Merge conflicts"
        style={{ position: "absolute", bottom: "10px", left: "10px" }}
      >
        Merge Conflicts
      </button>
    </div>
  );
}
