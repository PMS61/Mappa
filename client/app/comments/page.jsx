"use client";

import { RoomProvider } from "@/app/liveblocks.config.ts"; // Adjust the import path as needed
import Comments from "./Comments"; // Adjust the import path as needed
import { LiveblocksUIConfig } from "@liveblocks/react-ui";
import Cookies from "js-cookie";
import React, { useState } from 'react';
import Chatbot from '../chatbot/page';
import Meet from '../meet/page'; // Import the Meet component
import { FaComments, FaRobot, FaVideo } from 'react-icons/fa'; // Import icons

export default function CommentsPage({ roomId="global" }) {
  console.log("chat room id:", roomId)
  const username = Cookies.get("username");
  const [activeFeature, setActiveFeature] = useState("discussions");

  return (
    <LiveblocksUIConfig
      overrides={{ locale: "en", USER_UNKNOWN: username ? username : "Anonymous" /* ... */ }}
    >
      <RoomProvider
        id={roomId}
        initialPresence={{}} // Add any initial presence data if needed
        initialStorage={{}} // Add any initial storage data if needed
      >
        <div className="h-screen bg-gradient-to-r from-yellow-100 to-orange-100 backdrop-blur-md dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 flex flex-col">
          <h2 className="text-xl font-bold text-center p-4 bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent dark:from-blue-500 dark:to-purple-500">
            {activeFeature.charAt(0).toUpperCase() + activeFeature.slice(1)}
          </h2>
          <div className="flex justify-center space-x-4 p-2">
            <button onClick={() => setActiveFeature("discussions")} className="p-2 bg-blue-500 text-white rounded flex items-center space-x-2">
              <FaComments />
              <span>Discussions</span>
            </button>
            <button onClick={() => setActiveFeature("chatbot")} className="p-2 bg-blue-500 text-white rounded flex items-center space-x-2">
              <FaRobot />
              <span>Chatbot</span>
            </button>
            <button onClick={() => setActiveFeature("meet")} className="p-2 bg-blue-500 text-white rounded flex items-center space-x-2">
              <FaVideo />
              <span>Meet</span>
            </button>
          </div>
          <div className="flex-grow overflow-auto">
            {activeFeature === "discussions" && <Comments />}
            {activeFeature === "chatbot" && <Chatbot />}
            {activeFeature === "meet" && <Meet />}
          </div>
        </div>
      </RoomProvider>
    </LiveblocksUIConfig>
  );
}