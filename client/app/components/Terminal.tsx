"use client";

import {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import Cookies from "js-cookie";
import { FaPlay, FaBroom, FaTimes } from "react-icons/fa";
import styles from "./Terminal.module.css";

interface TerminalProps {
  height?: number;
  onClose?: () => void;
}

export interface TerminalRef {
  runScript: () => Promise<void>;
  clearTerminal: () => void;
}

export const Terminal = forwardRef<TerminalRef, TerminalProps>(
  ({ height = 300, onClose }, ref) => {
    const [terminalHeight, setTerminalHeight] = useState(height);
    const [terminalOutput, setTerminalOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const terminalContentRef = useRef<HTMLDivElement>(null);

    const handleResize = (e: React.MouseEvent) => {
      const startY = e.clientY;
      const startHeight = terminalHeight;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const newHeight = startHeight - (moveEvent.clientY - startY);
        if (newHeight > 100 && newHeight < window.innerHeight * 0.8) {
          setTerminalHeight(newHeight);
        }
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const detectLanguage = (filePath: string) => {
      const extension = filePath?.split(".").pop()?.toLowerCase() || "";
      switch (extension) {
        case "py":
          return "python";
        case "js":
        case "jsx":
        case "ts":
        case "tsx":
          return "javascript";
        case "sh":
          return "bash";
        default:
          return "python"; // Default language
      }
    };

    const runScript = async () => {
      setIsRunning(true);
      setTerminalOutput((prev) => prev + "\n$ Executing script...\n");

      const activeTab = Cookies.get("activeTab");
      const scriptContent = Cookies.get("beta") || "";
      const filePath = activeTab ? Cookies.get(`file_${activeTab}`) : "";
      const scriptLanguage = detectLanguage(filePath || "");

      try {
        const response = await fetch("http://localhost:8000/run-script", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            script: scriptContent,
            language: scriptLanguage,
          }),
        });

        const data = await response.json();
        setTerminalOutput((prev) => prev + (data.output || data.error));
      } catch (error) {
        console.error("Error running script:", error);
        setTerminalOutput(
          (prev) => prev + `\n[Error] Failed to connect to the server.`,
        );
      } finally {
        setIsRunning(false);
      }
    };

    const clearTerminal = () => {
      setTerminalOutput("");
    };

    useImperativeHandle(ref, () => ({
      runScript,
      clearTerminal,
    }));

    useEffect(() => {
      if (terminalContentRef.current) {
        terminalContentRef.current.scrollTop =
          terminalContentRef.current.scrollHeight;
      }
    }, [terminalOutput]);

    return (
      <div
        className={styles.terminalContainer}
        style={{ height: `${terminalHeight}px` }}
      >
        <div className={styles.resizeHandle} onMouseDown={handleResize} />
        <header className={styles.terminalHeader}>
          <div className={styles.windowControls}>
            <div className={`${styles.dot} ${styles.red}`} />
            <div className={`${styles.dot} ${styles.yellow}`} />
            <div className={`${styles.dot} ${styles.green}`} />
          </div>
          <span className={styles.terminalTitle}>Terminal</span>
          <div className={styles.actions}>
            <button
              onClick={runScript}
              disabled={isRunning}
              className={styles.actionButton}
            >
              <FaPlay className="mr-2" />
              {isRunning ? "Running..." : "Run"}
            </button>
            <button onClick={clearTerminal} className={styles.actionButton}>
              <FaBroom className="mr-2" />
              Clear
            </button>
            {onClose && (
              <button onClick={onClose} className={styles.actionButton}>
                <FaTimes />
              </button>
            )}
          </div>
        </header>
        <div className={styles.terminalContent} ref={terminalContentRef}>
          <pre>{terminalOutput || "Welcome to the Mappa terminal..."}</pre>
        </div>
      </div>
    );
  },
);

Terminal.displayName = "Terminal";
