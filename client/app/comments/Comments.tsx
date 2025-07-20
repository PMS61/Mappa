"use client";

import { Thread, Composer, LiveblocksUIConfig } from "@liveblocks/react-ui";
import { useThreads } from "@/app/liveblocks.config";
import { useEffect } from "react";
import "@liveblocks/react-ui/styles.css";
import { FaUserCircle } from "react-icons/fa";

/**
 * A helper function to format dates into a relative time string.
 * e.g., "5m ago", "2h ago", "3d ago"
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function Comments() {
  const { threads, refreshThreads } = useThreads();

  // Auto-refresh threads every 3 seconds to keep the view live
  useEffect(() => {
    const interval = setInterval(refreshThreads, 3000);
    return () => clearInterval(interval);
  }, [refreshThreads]);

  return (
    <div className="p-4 md:p-6 bg-white dark:bg-gray-800 h-full overflow-y-auto">
      {/* New Discussion Composer */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Start a Discussion
        </h2>
        <Composer
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 transition-all"
          inputClassName="w-full bg-transparent focus:outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500"
          placeholder="What's on your mind?"
        />
      </div>

      {/* List of Existing Threads */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Discussions
        </h2>
        {threads?.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No discussions yet.</p>
            <p className="text-sm">Be the first to start one!</p>
          </div>
        )}
        {threads?.map((thread) => (
          <div
            key={thread.id}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-600"
          >
            {/* Thread Header */}
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-gray-600">
              <FaUserCircle className="w-8 h-8 text-gray-400" />
              <div>
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  {thread.comments[0]?.userId || "Anonymous"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  {formatRelativeTime(new Date(thread.createdAt))}
                </span>
              </div>
            </div>

            {/* Liveblocks Thread Component */}
            <LiveblocksUIConfig overrides={{ USER_UNKNOWN: "Someone" }}>
              <Thread
                thread={thread}
                className="space-y-3"
                bodyClassName="text-gray-700 dark:text-gray-300 bg-transparent"
                composerClassName="mt-4"
                composerInputClassName="w-full bg-gray-100 dark:bg-gray-600 rounded-lg p-2 text-sm border border-gray-300 dark:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                composerSubmitClassName="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              />
            </LiveblocksUIConfig>
          </div>
        ))}
      </div>
    </div>
  );
}
