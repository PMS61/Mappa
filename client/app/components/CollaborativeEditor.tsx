"use client";

import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { useCallback, useEffect, useState } from "react";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import styles from "./CollaborativeEditor.module.css";
import { Avatars } from "./Avatars";
import { EditorTabs } from "./EditorTabs";
import { CommitModal } from "./CommitModal";

// Collaborative code editor with file tabs, live cursors, and live avatars
export function CollaborativeEditor({tabs, setTabs, activeTab, setActiveTab}) {
  const room = useRoom();
  const [element, setElement] = useState<HTMLElement>();
  // const [tabs, setTabs] = useState([
  //   { id: "1", name: "index.js" },
  //   { id: "2", name: "styles.css" },
  // ]);
  // const [activeTab, setActiveTab] = useState("1");
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);

  // Get user info from Liveblocks authentication endpoint
  const userInfo = useSelf((me) => me.info);
  const handleCommit = (message: string) => {
    // Implement your commit logic here
    console.log("Committing with message:", message);
  };
  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    setElement(node);
  }, []);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
  };

  const handleTabClose = (id: string) => {
    if (tabs.length > 1) {
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

  // Set up Liveblocks Yjs provider and attach CodeMirror editor
  useEffect(() => {
    let provider: LiveblocksYjsProvider;
    let ydoc: Y.Doc;
    let view: EditorView;

    if (!element || !room || !userInfo) {
      return;
    }

    // Create Yjs provider and document
    ydoc = new Y.Doc();
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

    return () => {
      ydoc?.destroy();
      provider?.destroy();
      view?.destroy();
    };
  }, [element, room, userInfo]);

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
            className={styles.commitButton}
            onClick={() => setIsCommitModalOpen(true)}
            title="Commit changes"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
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
    </div>
  );
}
