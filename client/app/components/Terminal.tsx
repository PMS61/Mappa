"use client";

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Cookies from 'js-cookie';
import styles from './Terminal.module.css';

interface TerminalProps {
  height?: number;
  initialOutput?: string;
  onClose?: () => void;
  autoRun?: boolean;
}

// Create ref type to expose functions
export interface TerminalRef {
  runScript: () => Promise<void>;
  clearTerminal: () => void;
}

export const Terminal = forwardRef<TerminalRef, TerminalProps>(
  ({ height = 300, initialOutput = '', onClose, autoRun = false }, ref) => {
    const [terminalHeight, setTerminalHeight] = useState(height);
    const [terminalOutput, setTerminalOutput] = useState(initialOutput);
    const [isRunning, setIsRunning] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);
    
    // Function to detect language from file extension
    const detectLanguage = (filePath: string) => {
      const extension = filePath.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'py':
          return 'python';
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
          return 'javascript';
        case 'sh':
          return 'bash';
        case 'java':
          return 'java';
        case 'c':
          return 'c';
        case 'cpp':
          return 'cpp';
        default:
          return 'python';
      }
    };

    // Function to run the script
    const runScript = async () => {
      setIsRunning(true);
      setTerminalOutput((prev) => prev + '\n$ Running script...\n');
      
      const activeTab = Cookies.get("activeTab");
      const scriptContent = Cookies.get("beta") || "";
      const filePathWithRepo = Cookies.get(`file_${activeTab}`) || "";
      const scriptLanguage = detectLanguage(filePathWithRepo);

      try {
        const response = await fetch("http://localhost:8000/run-script", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ script: scriptContent, language: scriptLanguage }),
        });
        
        const data = await response.json();
        setTerminalOutput((prev) => prev + data.output);
        
        // Auto-scroll to bottom
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      } catch (error) {
        console.error("Error running script:", error);
        setTerminalOutput((prev) => prev + "\nError running script: " + String(error));
      } finally {
        setIsRunning(false);
      }
    };

    // Function to clear the terminal
    const clearTerminal = () => {
      setTerminalOutput('');
    };

    // Expose functions to parent component via ref
    useImperativeHandle(ref, () => ({
      runScript,
      clearTerminal
    }));

    // Function to handle terminal resize
    const handleResize = (e: React.MouseEvent) => {
      const startY = e.clientY;
      const startHeight = terminalHeight;

      const onMouseMove = (e: MouseEvent) => {
        const newHeight = startHeight + (startY - e.clientY);
        setTerminalHeight(Math.max(100, newHeight)); // Minimum height of 100px
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    // REMOVED the automatic runScript effect

    return (
      <div className={styles.terminalContainer} style={{ height: `${terminalHeight}px` }}>
        <div className={styles.resizeHandle} onMouseDown={handleResize}></div>
        <div className={styles.terminalHeader}>
          <div className={styles.terminalControls}>
            <div className={styles.terminalDot} style={{ backgroundColor: '#FF5F56' }}></div>
            <div className={styles.terminalDot} style={{ backgroundColor: '#FFBD2E' }}></div>
            <div className={styles.terminalDot} style={{ backgroundColor: '#27C93F' }}></div>
          </div>
          <div className={styles.terminalTitle}>Terminal</div>
          <div className={styles.terminalActions}>
            <button 
              className={styles.terminalButton} 
              onClick={runScript} 
              disabled={isRunning}
            >
              {isRunning ? 'Running...' : 'Run'}
            </button>
            <button className={styles.terminalButton} onClick={clearTerminal}>Clear</button>
            {onClose && (
              <button className={styles.terminalButton} onClick={onClose}>Close</button>
            )}
          </div>
        </div>
        <div className={styles.terminalContent} ref={terminalRef}>
          <pre>{terminalOutput || 'Terminal ready...'}</pre>
        </div>
      </div>
    );
  }
);

Terminal.displayName = 'Terminal';
