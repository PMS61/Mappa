"use client";

import { RoomProvider } from "@/app/liveblocks.config.ts";
import Comments from "./Comments";
import { LiveblocksUIConfig } from "@liveblocks/react-ui";
import Cookies from "js-cookie";
import React, { useState } from "react";
import Chatbot from "../chatbot/page";
import Meet from "../meet/page";
import { FaComments, FaRobot, FaVideo } from "react-icons/fa";

// A single tab button component for better code organization and styling
const FeatureTab = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 w-full ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export default function CommentsPage({ roomId = "global" }) {
  const username = Cookies.get("username");
  const [activeFeature, setActiveFeature] = useState("discussions");

  // Renders the active component based on state
  const renderFeature = () => {
    switch (activeFeature) {
      case "chatbot":
        return <Chatbot />;
      case "meet":
        return <Meet />;
      case "discussions":
      default:
        return <Comments />;
    }
  };

  return (
    <LiveblocksUIConfig
      overrides={{
        locale: "en",
        USER_UNKNOWN: username || "Anonymous",
      }}
    >
      <RoomProvider id={roomId} initialPresence={{}} initialStorage={{}}>
        <div className="flex flex-col h-full w-full bg-white dark:bg-gray-800">
          {/* Header with modernized feature tabs */}
          <header className="flex-shrink-0 p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center space-x-2">
              <FeatureTab
                icon={<FaComments />}
                label="Discussions"
                isActive={activeFeature === "discussions"}
                onClick={() => setActiveFeature("discussions")}
              />
              <FeatureTab
                icon={<FaRobot />}
                label="Chatbot"
                isActive={activeFeature === "chatbot"}
                onClick={() => setActiveFeature("chatbot")}
              />
              <FeatureTab
                icon={<FaVideo />}
                label="Meet"
                isActive={activeFeature === "meet"}
                onClick={() => setActiveFeature("meet")}
              />
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-grow overflow-y-auto">{renderFeature()}</div>
        </div>
      </RoomProvider>
    </LiveblocksUIConfig>
  );
}
