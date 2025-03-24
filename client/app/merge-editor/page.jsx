"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const computeDiff = (aLines, bLines) => {
  let dp = Array(aLines.length + 1)
    .fill(null)
    .map(() => Array(bLines.length + 1).fill(0));

  for (let i = 0; i <= aLines.length; i++) {
    for (let j = 0; j <= bLines.length; j++) {
      if (i === 0) dp[i][j] = j;
      else if (j === 0) dp[i][j] = i;
      else if (aLines[i - 1] === bLines[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  let i = aLines.length,
    j = bLines.length,
    diff = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      diff.unshift({ text: aLines[i - 1], type: "same" });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      diff.unshift({ text: bLines[j - 1], type: "added" });
      j--;
    } else {
      diff.unshift({ text: aLines[i - 1], type: "deleted" });
      i--;
    }
  }
  return diff;
};

export default function Page() {
  const [selectedVersion, setSelectedVersion] = useState("merged");
  const [mergedContent, setMergedContent] = useState("");
  const [notification, setNotification] = useState(null);
  const [stats, setStats] = useState({ accepted: 0, rejected: 0, unchanged: 0 });

  const getFileContents = () => ({
    aText: Cookies.get("alpha") || "",
    bText: Cookies.get("beta") || "",
  });

  const { aText, bText } = getFileContents();
  const aLines = aText.split("\n");
  const bLines = bText.split("\n");
  const diff = computeDiff(aLines, bLines);

  useEffect(() => {
    // Initialize merged content
    const initialMerged = diff.map(line => line.text).join("\n");
    setMergedContent(initialMerged);

    // Calculate initial stats
    const initialStats = {
      accepted: 0,
      rejected: 0,
      unchanged: diff.filter(line => line.type === "added" || line.type === "deleted").length
    };
    setStats(initialStats);
  }, []);

  const handleAcceptChange = (index) => {
    const newDiff = [...diff];
    if (newDiff[index].type === "added" || newDiff[index].type === "deleted") {
      const previousType = newDiff[index].type;
      newDiff[index].type = "accepted";
      
      // Show notification
      setNotification({
        message: `Change accepted: ${newDiff[index].text.substring(0, 30)}${newDiff[index].text.length > 30 ? '...' : ''}`,
        type: "success"
      });
      
      // Update stats
      setStats(prev => ({
        ...prev,
        accepted: prev.accepted + 1,
        unchanged: prev.unchanged - 1
      }));
      
      // Hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    }
    updateMergedContent(newDiff);
  };

  const handleRejectChange = (index) => {
    const newDiff = [...diff];
    if (newDiff[index].type === "added") {
      newDiff[index].type = "rejected";
      
      // Show notification
      setNotification({
        message: `Addition rejected: ${newDiff[index].text.substring(0, 30)}${newDiff[index].text.length > 30 ? '...' : ''}`,
        type: "error"
      });
      
      // Update stats
      setStats(prev => ({
        ...prev,
        rejected: prev.rejected + 1,
        unchanged: prev.unchanged - 1
      }));
      
    } else if (newDiff[index].type === "deleted") {
      newDiff[index].type = "restored";
      
      // Show notification
      setNotification({
        message: `Deletion rejected (line restored): ${newDiff[index].text.substring(0, 30)}${newDiff[index].text.length > 30 ? '...' : ''}`,
        type: "warning"
      });
      
      // Update stats
      setStats(prev => ({
        ...prev,
        rejected: prev.rejected + 1,
        unchanged: prev.unchanged - 1
      }));
    }
    
    // Hide notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
    
    updateMergedContent(newDiff);
  };

  const updateMergedContent = (diffData) => {
    const content = diffData
      .filter(line => line.type !== "rejected")
      .map(line => line.text)
      .join("\n");
    setMergedContent(content);
  };

  const handleApplyMerged = () => {
    Cookies.set("beta", mergedContent);
    // Dispatch event to notify editor to update content
    window.dispatchEvent(
      new CustomEvent("revert-version", {
        detail: {
          content: mergedContent,
        },
      })
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 p-2 bg-gray-100 rounded-t-lg">
        <h2 className="text-xl font-semibold">Merge Conflicts</h2>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2 text-sm">
            <span className="px-2 py-1 bg-blue-100 rounded-md">
              Accepted: {stats.accepted}
            </span>
            <span className="px-2 py-1 bg-red-100 rounded-md">
              Rejected: {stats.rejected}
            </span>
            <span className="px-2 py-1 bg-gray-100 rounded-md">
              Pending: {stats.unchanged}
            </span>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedVersion("diff")}
              className={`px-3 py-1 rounded ${selectedVersion === "diff" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              View Differences
            </button>
            <button 
              onClick={() => setSelectedVersion("merged")}
              className={`px-3 py-1 rounded ${selectedVersion === "merged" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              View Merged
            </button>
            <button 
              onClick={handleApplyMerged}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Apply Merged Changes
            </button>
          </div>
        </div>
      </div>
      
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 p-3 rounded-md shadow-lg z-50 transition-opacity duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 
          notification.type === 'error' ? 'bg-red-500 text-white' : 
          'bg-yellow-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {selectedVersion === "diff" ? (
          <div className="w-full h-full overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Original Version (Alpha) */}
              <div className="border rounded-lg shadow bg-gray-50 p-2 overflow-auto h-full">
                <div className="text-sm font-medium mb-2 px-2 py-1 bg-blue-100 rounded">Original Version</div>
                <div className="font-mono text-sm whitespace-pre-wrap bg-white p-3 rounded h-[calc(100%-40px)] overflow-auto">
                  {aText || "No content available"}
                </div>
              </div>
              
              {/* Current Version (Beta) */}
              <div className="border rounded-lg shadow bg-gray-50 p-2 overflow-auto h-full">
                <div className="text-sm font-medium mb-2 px-2 py-1 bg-green-100 rounded">Current Version</div>
                <div className="font-mono text-sm whitespace-pre-wrap bg-white p-3 rounded h-[calc(100%-40px)] overflow-auto">
                  {bText || "No content available"}
                </div>
              </div>
            </div>
            
            {/* Diff View */}
            <div className="mt-4 border rounded-lg shadow p-4 bg-gray-50">
              <div className="text-sm font-medium mb-2 px-2 py-1 bg-purple-100 rounded">Changes</div>
              <div className="overflow-auto max-h-[400px] font-mono text-sm bg-white p-3 rounded">
                {diff.map((line, index) => (
                  <div
                    key={index}
                    className={`flex items-center py-1 px-2 ${
                      line.type === "added" ? "bg-green-100 border-l-4 border-green-500" : 
                      line.type === "deleted" ? "bg-red-100 border-l-4 border-red-500" : 
                      line.type === "accepted" ? "bg-blue-100 border-l-4 border-blue-500" :
                      line.type === "rejected" ? "line-through bg-gray-100 border-l-4 border-gray-500" :
                      line.type === "restored" ? "bg-yellow-100 border-l-4 border-yellow-500" : ""
                    } transition-all duration-300`}
                  >
                    <div className="flex-grow overflow-x-auto whitespace-pre">
                      {line.type === "added" && <span className="text-green-500 mr-2">+</span>}
                      {line.type === "deleted" && <span className="text-red-500 mr-2">-</span>}
                      {line.type === "accepted" && <span className="text-blue-500 mr-2">✓</span>}
                      {line.type === "rejected" && <span className="text-gray-500 mr-2">✗</span>}
                      {line.type === "restored" && <span className="text-yellow-500 mr-2">↩</span>}
                      {line.text}
                    </div>
                    {(line.type === "added" || line.type === "deleted") && (
                      <div className="flex space-x-1 ml-2">
                        <button 
                          onClick={() => handleAcceptChange(index)} 
                          className="text-xs bg-green-500 text-white px-2 py-0.5 rounded hover:bg-green-600 transition-colors"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleRejectChange(index)} 
                          className="text-xs bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {(line.type === "accepted" || line.type === "rejected" || line.type === "restored") && (
                      <div className="flex space-x-1 ml-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-200">
                          {line.type === "accepted" ? "Accepted" : line.type === "rejected" ? "Rejected" : "Restored"}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
            <div className="flex-grow overflow-auto border rounded-lg shadow p-4 bg-white">
              <div className="text-sm font-medium mb-2 px-2 py-1 bg-green-100 rounded">Merged Result</div>
              <textarea 
                className="w-full h-full min-h-[400px] font-mono text-sm p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={mergedContent}
                onChange={(e) => setMergedContent(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
