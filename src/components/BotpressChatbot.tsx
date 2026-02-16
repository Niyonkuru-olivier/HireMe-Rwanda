"use client";

import { useEffect, useState } from 'react';

export default function BotpressChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log('Botpress chatbot component mounted');
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <button
        onClick={toggleChat}
        className="chatbot-button"
        aria-label="Toggle chatbot"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(255, 152, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          animation: 'pulse-orange 2s infinite',
          zIndex: 9999,
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{ width: '30px', height: '30px', fill: 'white' }}
        >
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
        </svg>
      </button>

      {/* Chatbot Iframe */}
      {isOpen && (
        <div
          onClick={handleClickOutside}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9998,
          }}
        >
          <iframe
            src="https://cdn.botpress.cloud/webchat/v3.6/shareable.html?configUrl=https://files.bpcontent.cloud/2026/02/16/17/20260216175210-EE4UUI1L.json"
            title="JobConnect Chatbot"
            style={{
              position: 'fixed',
              bottom: '90px',
              right: '20px',
              width: '400px',
              height: '600px',
              maxWidth: 'calc(100vw - 40px)',
              maxHeight: 'calc(100vh - 120px)',
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
              zIndex: 9999,
            }}
          />
        </div>
      )}

      {/* Styles */}
      <style jsx global>{`
        @keyframes pulse-orange {
          0%, 100% { box-shadow: 0 4px 15px rgba(255, 152, 0, 0.5); }
          50% { box-shadow: 0 4px 25px rgba(255, 152, 0, 0.9); }
        }
        
        .chatbot-button:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 6px 20px rgba(255, 152, 0, 0.6) !important;
        }
      `}</style>
    </>
  );
}
