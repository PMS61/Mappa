"use client";

import React from 'react';
import { FaVideo } from 'react-icons/fa'; // Import icon

const Meet = () => {
  return (
    <div className="flex flex-col w-full h-full bg-gradient-to-r from-blue-100 to-green-100 backdrop-blur-md dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
      <div className="flex-grow flex flex-col items-center justify-center space-y-4">
        <FaVideo className="text-6xl text-blue-500" />
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-green-800 bg-clip-text text-transparent dark:from-blue-500 dark:to-purple-500">
          Join Meet
        </h2>
        <p className="text-center text-gray-700 dark:text-gray-300">
          Connect with your team in a seamless and interactive meeting environment.
        </p>
        <button className="p-4 bg-blue-500 text-white rounded flex items-center space-x-2">
          <FaVideo />
          <span>Join Meet</span>
        </button>
      </div>
    </div>
  );
};

export default Meet;
