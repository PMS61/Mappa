"use client";

import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { useCallback, useEffect, useState, useRef, forwardRef } from "react";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { Avatars } from "./Avatars";
import { EditorTabs } from "./EditorTabs";
import { Terminal, TerminalRef } from "./Terminal";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { Octokit } from "@octokit/rest";
import {
  FaSave,
  FaGithub,
  FaCodeBranch,
  FaTerminal,
  FaTimes,
} from "react-icons/fa";

const MergeEditor = dynamic(() => import("../merge-editor/page"), {
  ssr: false,
});

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || "";
const octokit = new Octokit({ auth: GITHUB_TOKEN });

// A more modern, styled modal component
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md m-4 transform transition-transform scale-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Main Collaborative Editor Component
export function CollaborativeEditor({
  tabs,
  setTabs,
  activeTab,
  setActiveTab,
}: {
  tabs: any[];
  setTabs: (tabs: any[]) => void;
  activeTab: string | null;
  setActiveTab: (id: string) => void;
}) {
  const room = useRoom();
  const [element, setElement] = useState<HTMLElement>();
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [isMergeEditorOpen, setIsMergeEditorOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const terminalRef = useRef<TerminalRef>(null);
  const userInfo = useSelf((me) => me.info);

  const ydocsRef = useRef<Map<string, Y.Doc>>(new Map());

  const getYDoc = useCallback((tabId: string) => {
    if (!ydocsRef.current.has(tabId)) {
      ydocsRef.current.set(tabId, new Y.Doc());
    }
    return ydocsRef.current.get(tabId)!;
  }, []);

  const handleCommit = async (message: string) => {
    if (!activeTab) return;
    const uid = Cookies.get("username");
    const repoId = Cookies.get("repo_id");
    const activeYDoc = getYDoc(activeTab);
    const ytext = activeYDoc.getText("codemirror").toString();
    const filePath = Cookies.get(`file_${activeTab}`);
    Cookies.set("alpha", ytext);

    const commitData = {
      repo_id: repoId,
      uid: uid,
      commit: message,
      files: [{ path: filePath, content: ytext }],
    };

    try {
      const res = await fetch("http://localhost:8000/version/post-version", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commitData),
      });

      if (res.ok) {
        alert("Commit successful!");
        setIsCommitModalOpen(false);
      } else {
        alert("Commit failed.");
      }
    } catch (e) {
      console.error("Error committing changes:", e);
      alert("An error occurred while committing.");
    }
  };

  async function handlePushToGithub() {
    const message = prompt("Enter commit message:");
    if (!message) return;

    const contentToPush = Cookies.get("beta") || "";
    const owner = "Ghruank"; // This should ideally be configurable
    const repoName = Cookies.get("repo_name");
    const filePathWithRepo = activeTab
      ? Cookies.get(`file_${activeTab}`)
      : undefined;
    if (!repoName || !filePathWithRepo) {
      alert("Repository or file information is missing.");
      return;
    }
    const filePath = filePathWithRepo.split("/").slice(1).join("/");
    const branch = "main";

    try {
      let sha: string | undefined;
      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo: repoName,
          path: filePath,
          ref: branch,
        });
        if (!Array.isArray(data)) {
          sha = data.sha;
        }
      } catch (error: any) {
        if (error.status !== 404) throw error;
      }

      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path: filePath,
        message,
        content: btoa(contentToPush),
        branch,
        sha,
      });

      alert(`File ${sha ? "updated" : "created"} successfully!`);
    } catch (error) {
      console.error("Error pushing file:", error);
      alert("Failed to push to GitHub.");
    }
  }

  const ref = useCallback((node: HTMLElement | null) => {
    if (node) setElement(node);
  }, []);

  const handleTabClose = (id: string) => {
    const ydoc = ydocsRef.current.get(id);
    if (ydoc) {
      ydoc.destroy();
      ydocsRef.current.delete(id);
    }

    const newTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(newTabs);

    if (activeTab === id) {
      setActiveTab(newTabs.length > 0 ? newTabs[0].id : null);
    }
  };

  useEffect(() => {
    const handleRevertEvent = (event: any) => {
      if (!activeTab) return;
      const { content } = event.detail;
      const activeYDoc = getYDoc(activeTab);
      const ytext = activeYDoc.getText("codemirror");
      ytext.delete(0, ytext.length);
      ytext.insert(0, content);
    };

    window.addEventListener("revert-version", handleRevertEvent);
    return () =>
      window.removeEventListener("revert-version", handleRevertEvent);
  }, [activeTab, getYDoc]);

  useEffect(() => {
    if (!element || !room || !userInfo || !activeTab) return;

    const ydoc = getYDoc(activeTab);
    const provider = new LiveblocksYjsProvider(room as any, ydoc);
    const ytext = ydoc.getText("codemirror");

    provider.awareness.setLocalStateField("user", {
      name: userInfo.name,
      color: userInfo.color,
      colorLight: userInfo.color + "80",
    });

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        javascript(),
        yCollab(ytext, provider.awareness),
        EditorView.theme({
          "&": { height: "100%" },
          ".cm-scroller": { overflow: "auto" },
        }),
      ],
    });

    const view = new EditorView({ state, parent: element });

    ytext.observe(() => Cookies.set("beta", ytext.toString()));

    return () => {
      provider.destroy();
      view.destroy();
    };
  }, [element, room, userInfo, activeTab, getYDoc]);

  const toggleTerminal = () => {
    setIsTerminalOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        setTimeout(() => terminalRef.current?.runScript(), 100);
      }
      return nextState;
    });
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-800">
      <header className="flex-shrink-0 flex items-center justify-between bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <EditorTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
          onTabClose={handleTabClose}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCommitModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            title="Commit changes"
          >
            <FaSave />
            Commit
          </button>
          <button
            onClick={handlePushToGithub}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            title="Push to GitHub"
          >
            <FaGithub />
            Push
          </button>
          <Avatars />
        </div>
      </header>

      <main
        className="flex-grow relative"
        style={{ height: isTerminalOpen ? `calc(100% - 250px)` : "100%" }}
      >
        <div className="h-full w-full" ref={ref}></div>
      </main>

      <footer className="absolute bottom-4 left-4 flex gap-3 z-10">
        <button
          onClick={() => setIsMergeEditorOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
        >
          <FaCodeBranch />
          Merge Conflicts
        </button>
        <button
          onClick={toggleTerminal}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg shadow-lg hover:bg-gray-800 transition-transform transform hover:scale-105"
        >
          <FaTerminal />
          {isTerminalOpen ? "Close Terminal" : "Run Code"}
        </button>
      </footer>

      {isTerminalOpen && (
        <div className="absolute bottom-0 left-0 right-0 z-20 flex-shrink-0">
          <Terminal
            ref={terminalRef}
            height={250}
            onClose={() => setIsTerminalOpen(false)}
          />
        </div>
      )}

      <Modal
        isOpen={isCommitModalOpen}
        onClose={() => setIsCommitModalOpen(false)}
        title="Commit Changes"
      >
        <CommitModalContent onCommit={handleCommit} />
      </Modal>

      <Modal
        isOpen={isMergeEditorOpen}
        onClose={() => setIsMergeEditorOpen(false)}
        title="Merge Editor"
      >
        <MergeEditor />
      </Modal>
    </div>
  );
}

const CommitModalContent = ({
  onCommit,
}: {
  onCommit: (message: string) => void;
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onCommit(message.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-3 border rounded-md mb-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        placeholder="Enter commit message..."
        rows={4}
        required
        autoFocus
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium"
        >
          Commit
        </button>
      </div>
    </form>
  );
};
