"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./styles.css";

const DisplayFileContent = ({ 
  onClose, 
  version, 
  isVersionView = false,
  fileContent: initialContent = "",
  fileName: initialFileName = "",
  filePath = "" 
}) => {
  const [content, setContent] = useState(initialContent);
  const [fileName, setFileName] = useState(initialFileName);
  const [fileType, setFileType] = useState("text");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Set content and filename from props if provided
    if (initialContent && isVersionView) {
      setContent(initialContent);
      setFileName(initialFileName || "Untitled");
      return;
    }
    
    // Then check URL params if available (for direct navigation)
    const contentParam = searchParams.get("content");
    const nameParam = searchParams.get("fileName") || "Untitled";
    const typeParam = searchParams.get("fileType") || "text";

    if (contentParam) {
      setContent(decodeURIComponent(contentParam));
      setFileName(nameParam);
      setFileType(typeParam);
    }
  }, [searchParams, isVersionView, initialContent, initialFileName]);

  const determineLanguage = () => {
    if (!fileName) return "text";
    
    const extension = fileName.split('.').pop().toLowerCase();
    
    const extensionMap = {
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "tsx",
      py: "python",
      java: "java",
      html: "html",
      css: "css",
      json: "json",
      md: "markdown",
      // Add more mappings as needed
    };
    
    return extensionMap[extension] || "text";
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="min-h-screen file-display-container p-4 sm:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden content-panel">
        <div className="p-4 sm:p-6 border-b border-blue-100 panel-header">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              {isVersionView ? (
                <h2 className="text-xl font-semibold text-gray-800">
                  {fileName || "Untitled"}
                  {version && <span className="ml-2 text-sm text-purple-600">Version: {version}</span>}
                </h2>
              ) : (
                <input
                  type="text"
                  value={fileName}
                  onChange={handleFileNameChange}
                  placeholder="Filename"
                  className="w-full px-4 py-2 text-gray-700 bg-white border-2 border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:from-blue-600 hover:to-purple-600 transition-colors"
                onClick={() => {
                  navigator.clipboard.writeText(content);
                  alert("Content copied to clipboard!");
                }}
              >
                Copy
              </button>
              {isVersionView ? (
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Close
                </button>
              ) : (
                <button 
                  className="px-4 py-2 bg-white text-blue-700 border-2 border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                  onClick={() => window.print()}
                >
                  Print
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="overflow-auto max-h-[70vh] content-display">
              <SyntaxHighlighter
                language={determineLanguage()}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '20px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  background: 'linear-gradient(to right, rgba(255,255,255,0.98), rgba(240,245,255,0.95))'
                }}
                showLineNumbers={true}
                wrapLines={true}
                lineNumberStyle={{color: '#8B5CF6'}}
                codeTagProps={{style: {color: '#1E40AF'}}}
              >
                {content || "// No content to display"}
              </SyntaxHighlighter>
            </div>
          )}
        </div>

        {!isVersionView && (
          <div className="p-4 sm:p-6 border-t border-blue-100 panel-footer">
            <div>
              <h3 className="text-sm font-medium text-purple-700 mb-2">Manual Input</h3>
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="Paste file content here..."
                className="w-full px-4 py-2 text-gray-700 bg-white border-2 border-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 min-h-[150px]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayFileContent;
