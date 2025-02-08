"use client"

import React, { useState, useEffect } from 'react'
import ChatInput from './ChatInput'
import ChatMessages from './ChatMessages'

const Chat = ({socket}) => {
  const [conversation, setConversation] = useState([
    { sender: 'User1', message: 'Hello!', type: 'primary' },
    { sender: 'User2', message: 'Hi!', type: 'secondary' },
  ])

  useEffect(() => {
    if (!socket) return;
    socket.on('chat-message', (data) => {
      setConversation(prev => [...prev, data]);
    });
    socket.on('typing', (username) => {
      console.log(`${username} is typing...`);
      // Optionally set some state to display "User is typing..."
    });
  }, [socket]);

  const addMessage = (message) => {
    setConversation([...conversation, message])
  }

  return (
    <div className="h-screen bg-gradient-to-r from-yellow-100 to-orange-100 backdrop-blur-md dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 flex flex-col">
      <h2 className="text-xl font-bold text-center p-4 bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent dark:from-blue-500 dark:to-purple-500">
        Chat
      </h2>
      <div className="flex-grow overflow-y-auto px-2 bg-yellow-50 dark:bg-gray-700 flex flex-col space-y-4">
        <ChatMessages conversation={conversation} />
      </div>
      <div className="p-2">
        <ChatInput addMessage={addMessage} socket={socket} />
      </div>
    </div>
  )
}

export default Chat