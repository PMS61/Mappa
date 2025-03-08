"use client"

import React, { useState, useEffect } from 'react'
import { FaPaperPlane, FaRedo } from 'react-icons/fa'; // Import icons
import ReactMarkdown from 'react-markdown' // Import ReactMarkdown
import Cookies from 'js-cookie'

const Chatbot = () => {
  const [alphaContext, setAlphaContext] = useState("")
  const [conversation, setConversation] = useState([])
  const [input, setInput] = useState("")

  useEffect(() => {
    // let betaMatch = Cookies.get("beta");
    // setAlphaContext(betaMatch);
    // if (betaMatch) {
    //   setAlphaContext(decodeURIComponent(betaMatch[2]))
    // }
  }, [])
  let betaMatch
  const sendMessage = async () => {
    try {
      betaMatch = Cookies.get("beta");
      setAlphaContext(betaMatch);
      console.log(betaMatch);
      setAlphaContext((prevAlphaContext) => {
        console.log("Alpha context:", prevAlphaContext)
        const decodedInput = decodeURIComponent(input)
        console.log("Sending message:", decodedInput)
        fetch("http://localhost:8000/api/chatbot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            alphaContext: prevAlphaContext,
            conversation: conversation.map(msg => ({
              role: msg.sender === "User" ? "user" : "assistant",
              content: msg.message
            })),
            newMessage: decodedInput
          })
        })
        .then(response => {
          if (!response.ok) {
            console.error("Non-200 response:", response.status)
            return
          }
          return response.json()
        })
        .then(data => {
          console.log("Received response:", data)
          if (!data.error) {
            setConversation([
              ...conversation,
              { sender: "User", message: decodedInput },
              { sender: "MappaAI", message: data.response }
            ])
            setInput("")
          } else {
            console.error("Error from API:", data)
          }
        })
        .catch(error => {
          console.error("Error sending message:", error)
        })
        return prevAlphaContext
      })
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const renderMessage = (msg, index) => {
    if (msg.sender === "MappaAI" && msg.message.startsWith("```") && msg.message.endsWith("```")) {
      const codeSnippet = msg.message.slice(3, -3)
      return (
        <pre key={index} className="p-2 rounded bg-green-200">
          <code>{codeSnippet}</code>
        </pre>
      )
    }
    return (
      <div key={index} className={`p-2 rounded ${msg.sender === "User" ? "bg-blue-200" : "bg-green-200"}`}>
        <strong>{msg.sender}:</strong> <ReactMarkdown>{msg.message}</ReactMarkdown>
      </div>
    )
  }

  const startNewChat = () => {
    setConversation([])
    setInput("")
  }

  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-r from-blue-100 to-green-100 backdrop-blur-md dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
      {/* <h2 className="text-xl font-bold text-center p-4 bg-gradient-to-r from-blue-600 to-green-800 bg-clip-text text-transparent dark:from-blue-500 dark:to-purple-500">
        Chatbot
      </h2> */}
      <div className="flex-grow overflow-y-auto px-2 bg-blue-50 dark:bg-gray-700 flex flex-col space-y-4">
        {conversation.map(renderMessage)}
      </div>
      <div className="p-2 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded flex items-center justify-center">
          <FaPaperPlane />
        </button>
        <button onClick={startNewChat} className="p-2 bg-red-500 text-white rounded flex items-center justify-center">
          <FaRedo />
        </button>
      </div>
    </div>
  )
}

export default Chatbot
