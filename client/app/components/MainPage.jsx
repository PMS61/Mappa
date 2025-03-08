"use client";

import React, { useState } from "react";
import { FaComments, FaRobot, FaVideo } from "react-icons/fa";
import CommentsPage from "../comments/page";
import Chatbot from "../chatbot/page";
import VideoConf from "../videoconf/page";

export default function MainPage() {
  const [activeComponent, setActiveComponent] = useState("comments");

  const renderComponent = () => {
    switch (activeComponent) {
      case "comments":
        return <CommentsPage />;
      case "chatbot":
        return <Chatbot />;
      case "meet":
        return <VideoConf />;
      default:
        return <CommentsPage />;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-center space-x-4 p-4 bg-gray-200 dark:bg-gray-800">
        <button
          onClick={() => setActiveComponent("comments")}
          className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FaComments />
          <span>TextRoom</span>
        </button>
        <button
          onClick={() => setActiveComponent("chatbot")}
          className="flex items-center space-x-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <FaRobot />
          <span>Chatbot</span>
        </button>
        <button
          onClick={() => setActiveComponent("meet")}
          className="flex items-center space-x-2 p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <FaVideo />
          <span>Meet</span>
        </button>
      </div>
      <div className="flex-grow overflow-auto">{renderComponent()}</div>
    </div>
  );
}
