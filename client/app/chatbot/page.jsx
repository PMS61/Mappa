"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaRedo, FaRobot } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import Cookies from "js-cookie";
import remarkGfm from "remark-gfm";

const Chatbot = () => {
  const [alphaContext, setAlphaContext] = useState("");
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    // Greet the user when the component loads
    setConversation([
      {
        sender: "MappaAI",
        message: "Hello! I'm MappaAI. How can I help you with your code today?",
      },
    ]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "User", message: input };
    setConversation((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const betaMatch = Cookies.get("beta") || "";
      const currentConversation = conversation.map((msg) => ({
        role: msg.sender === "User" ? "user" : "assistant",
        content: msg.message,
      }));

      const response = await fetch("http://localhost:8000/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alphaContext: betaMatch,
          conversation: currentConversation,
          newMessage: input,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.error) {
        setConversation((prev) => [
          ...prev,
          { sender: "MappaAI", message: data.response },
        ]);
      } else {
        throw new Error(data.detail || "An unknown error occurred.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setConversation((prev) => [
        ...prev,
        {
          sender: "MappaAI",
          message:
            "Sorry, I'm having trouble connecting. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    setConversation([
      {
        sender: "MappaAI",
        message: "Hello! How can I assist you?",
      },
    ]);
    setInput("");
  };

  const renderMessage = (msg, index) => {
    const isUser = msg.sender === "User";
    return (
      <div
        key={index}
        className={`flex items-start gap-3 ${isUser ? "justify-end" : ""}`}
      >
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <FaRobot className="text-white" />
          </div>
        )}
        <div
          className={`max-w-md md:max-w-lg p-3 rounded-2xl ${
            isUser
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none"
          }`}
        >
          <div className="prose dark:prose-invert prose-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                pre: ({ node, ...props }) => (
                  <pre
                    className="bg-gray-800 text-white p-2 rounded-md"
                    {...props}
                  />
                ),
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <div className="bg-gray-800 text-white p-2 rounded-md my-2">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </div>
                  ) : (
                    <code
                      className="bg-gray-300 dark:bg-gray-600 px-1 rounded"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {msg.message}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {conversation.map(renderMessage)}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <FaRobot className="text-white" />
            </div>
            <div className="max-w-md md:max-w-lg p-3 rounded-2xl bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-bl-none">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-3 pr-20 border rounded-full bg-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ask MappaAI..."
            disabled={isLoading}
          />
          <div className="absolute right-2 flex items-center">
            <button
              onClick={startNewChat}
              className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-full transition-colors"
              title="New Chat"
            >
              <FaRedo />
            </button>
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              title="Send Message"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
