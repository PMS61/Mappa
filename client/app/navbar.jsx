"use client";
import Cookies from "js-cookie";
import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeProvider";
import { FaSun, FaMoon } from "react-icons/fa";
import { usePathname } from 'next/navigation'; // Import usePathname

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState("Guest");
  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    const user = Cookies.get("username");
    if (user) {
      setUsername(user);
    }
  }, []);

  return (
    <nav className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg shadow-md rounded-xl sticky top-4 z-50 mb-6">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <a
          href="/"
          className="text-2xl font-bold text-gray-800 dark:text-white"
        >
          Mappa ✨
        </a>
        <div className="flex items-center space-x-6">
          {pathname !== '/' && ( // Conditionally render based on pathname
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 hidden sm:block">
              Welcome, {username}
            </p>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
