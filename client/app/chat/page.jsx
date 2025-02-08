"use client"

import React, { useState } from 'react'
import ChatInput from './ChatInput'
import ChatMessages from './ChatMessages'

const Chat = ({socket}) => {
  const [conversation, setConversation] = useState([
    { sender: 'User1', message: 'What kind of nonsense is this', type: 'primary' },
    { sender: 'User1', message: 'Put me on the Council and not make me a Master!?', type: 'secondary' },
    { sender: 'User1', message: "That's never been done in the history of the Jedi. It's insulting!", type: 'accent' },
    { sender: 'User2', message: 'Calm down, Anakin.', type: 'info' },
    { sender: 'User2', message: 'You have been given a great honor.', type: 'success' },
    { sender: 'User2', message: 'To be on the Council at your age.', type: 'warning' },
    { sender: 'User2', message: "It's never happened before.", type: 'error' }
  ])

  const addMessage = (message) => {
    setConversation([...conversation, message])
  }

  return (
    <div className="h-full bg-gradient-to-r from-yellow-100 to-orange-100 backdrop-blur-md dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 flex flex-col">
      <h2 className="text-xl font-bold text-center p-4 bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent dark:from-blue-500 dark:to-purple-500">
        Chat
      </h2>
      <div className="flex-grow overflow-y-auto px-2 bg-yellow-50 dark:bg-gray-700 flex flex-col space-y-4">
        <ChatMessages conversation={conversation} />
      </div>
      <div className="p-2">
        <ChatInput addMessage={addMessage} />
      </div>
    </div>
  )
}

export default Chat
