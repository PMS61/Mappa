"use client";

import { Thread, Composer } from "@liveblocks/react-ui";
import { useThreads } from "@/app/liveblocks.config.ts";
import { formatDistanceToNow } from "date-fns";
import { UserAvatar } from "./user-avatar"; // Assume you have a user avatar component
import "@liveblocks/react-ui/styles.css";

export default function Comments() {
  const { threads } = useThreads();

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-sm">
      {/* New Discussion Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Start New Discussion</h2>
        <div className="space-y-4">
          <Composer 
            className="bg-gray-50 rounded-lg p-4 shadow-sm border border-gray-200 focus-within:border-blue-500 transition-colors"
            inputClassName="w-full bg-transparent focus:outline-none text-gray-900 placeholder-gray-500"
            placeholder="What would you like to discuss..."
            submitClassName="hidden" // Hide default submit button
          />
          <div className="flex justify-end gap-2 mt-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Discussions List */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Discussions</h2>
        {threads?.map((thread) => (
          <div key={thread.id} className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-200">
            {/* Thread Header */}
            <div className="flex items-center gap-3 mb-3">
              <UserAvatar 
                name={thread.author?.name || "Anonymous"} 
                className="h-8 w-8"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {thread.author?.name || "Anonymous"}
                </p>
                <p className="text-xs text-gray-500">
                  {thread.createdAt 
                    ? formatDistanceToNow(new Date(thread.createdAt.toString()), { 
                        addSuffix: true 
                      }) 
                    : "Just now"}
                </p>
              </div>
            </div>

            {/* Thread Content */}
            <Thread 
              thread={thread}
              className="space-y-4"
              headerClassName="hidden" // Hide default header
              bodyClassName="text-gray-700 bg-white rounded-lg p-3 border border-gray-200"
              actionsClassName="flex gap-2 mt-2"
              replyClassName="ml-6 pl-4 border-l-2 border-gray-200"
              composerInputClassName="w-full bg-gray-50 rounded-lg p-2 text-sm border border-gray-200 focus:outline-none focus:border-blue-500"
              composerSubmitClassName="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            />
          </div>
        ))}
      </div>
    </div>
  );
}