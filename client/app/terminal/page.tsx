"use client";

import { useState, useEffect } from 'react';
import { Terminal } from '../components/Terminal';
import Link from 'next/link';
import Cookies from 'js-cookie';

export default function TerminalPage() {
  const [activeTabInfo, setActiveTabInfo] = useState({
    id: '',
    name: ''
  });

  useEffect(() => {
    // Get the active tab information from cookies
    const id = Cookies.get('activeTab') || '';
    const name = Cookies.get(`file_${id}`) || 'Unknown file';
    
    setActiveTabInfo({
      id,
      name: name.split('/').pop() || name
    });
  }, []);

  return (
    <div className="terminal-page">
      <div className="terminal-page-header">
        <Link href="/" className="back-button">
          &larr; Back to Editor
        </Link>
        <h1>Terminal: Running {activeTabInfo.name}</h1>
      </div>
      
      <div className="terminal-wrapper">
        <Terminal height={500} />
      </div>
      
      <style jsx>{`
        .terminal-page {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100vh;
          padding: 20px;
          box-sizing: border-box;
          background-color: #f5f5f5;
        }
        
        .terminal-page-header {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .back-button {
          background-color: #444;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        
        .back-button:hover {
          background-color: #555;
        }
        
        h1 {
          font-size: 1.5rem;
          margin: 0;
        }
        
        .terminal-wrapper {
          flex: 1;
          width: 100%;
        }
        
        @media (max-width: 768px) {
          .terminal-page {
            padding: 10px;
          }
          
          .terminal-page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 15px;
          }
          
          h1 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}
