"use client";

import React from "react";

const Placeholder = () => {
  return (
    <div className="placeholder-container">
      <div className="content-area">
        <div className="logo-area">
          <div className="code-icon">
            <span className="bracket">{`{`}</span>
            <span className="dots">...</span>
            <span className="bracket">{`}`}</span>
          </div>
        </div>
        <h1>Welcome to Code Editor</h1>
        <p>No open tabs. Create a new file or open an existing one.</p>
        <div className="decorative-elements">
          <div className="code-line"></div>
          <div className="code-line"></div>
          <div className="code-line"></div>
        </div>
      </div>

      <style jsx>{`
        .placeholder-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100%;
          background-color: #fff;
          color: #333;
          font-family: 'Arial', sans-serif;
        }
        
        .content-area {
          text-align: center;
          max-width: 600px;
          padding: 2rem;
        }
        
        .logo-area {
          margin-bottom: 2rem;
        }
        
        .code-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          animation: pulse 2s infinite ease-in-out;
        }
        
        .bracket {
          color: #6200ee; /* Purple */
          font-weight: bold;
        }
        
        .dots {
          color: #3700B3; /* Darker purple */
          letter-spacing: 3px;
        }
        
        h1 {
          color: #3700B3; /* Darker purple */
          margin-bottom: 1rem;
        }
        
        p {
          color: #666;
          margin-bottom: 2rem;
          line-height: 1.5;
        }
        
        .decorative-elements {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 70%;
          margin: 0 auto;
        }
        
        .code-line {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(90deg, #3700B3, #6200ee);
          opacity: 0.7;
        }
        
        .code-line:nth-child(1) {
          width: 80%;
        }
        
        .code-line:nth-child(2) {
          width: 60%;
        }
        
        .code-line:nth-child(3) {
          width: 40%;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @media (max-width: 768px) {
          .content-area {
            padding: 1rem;
          }
          
          .code-icon {
            font-size: 2.5rem;
          }
          
          h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Placeholder;
