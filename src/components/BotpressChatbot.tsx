"use client";

import { useEffect } from 'react';

export default function BotpressChatbot() {
  useEffect(() => {
    // Wait for Botpress to load, then apply custom styling
    const checkBotpress = setInterval(() => {
      const botpressWidget = document.querySelector('#bp-web-widget-container');
      if (botpressWidget) {
        clearInterval(checkBotpress);
        
        // Add custom styles for the chatbot
        const style = document.createElement('style');
        style.id = 'botpress-custom-styles';
        style.textContent = `
          /* Botpress Webchat Custom Styling */
          #bp-web-widget-container {
            z-index: 9999 !important;
          }
          
          /* Custom button color - Orange/Gold to stand out from green theme */
          #bp-web-widget-container button[aria-label="Toggle chat window"],
          #bp-web-widget-container .bpw-widget-btn {
            background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%) !important;
            box-shadow: 0 4px 15px rgba(255, 152, 0, 0.5) !important;
            border: none !important;
          }
          
          #bp-web-widget-container button[aria-label="Toggle chat window"]:hover,
          #bp-web-widget-container .bpw-widget-btn:hover {
            background: linear-gradient(135deg, #f57c00 0%, #e65100 100%) !important;
            transform: scale(1.08) !important;
            box-shadow: 0 6px 20px rgba(255, 152, 0, 0.6) !important;
            transition: all 0.3s ease !important;
          }
          
          /* Chat header color - Orange theme */
          .bpw-header,
          .bpw-header-container {
            background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%) !important;
          }
          
          /* Send button color */
          .bpw-send-button,
          .bpw-send-btn {
            background-color: #ff9800 !important;
          }
          
          .bpw-send-button:hover,
          .bpw-send-btn:hover {
            background-color: #f57c00 !important;
          }
          
          /* User message bubbles - Orange */
          .bpw-from-user .bpw-chat-bubble,
          .bpw-message-user {
            background-color: #ff9800 !important;
            color: white !important;
          }
          
          /* Bot message bubbles - Light gray */
          .bpw-from-bot .bpw-chat-bubble,
          .bpw-message-bot {
            background-color: #f5f5f5 !important;
            color: #333 !important;
          }
          
          /* Typing indicator */
          .bpw-typing-bubble {
            background-color: #f5f5f5 !important;
          }
          
          /* Input field focus */
          .bpw-composer-inner textarea:focus {
            border-color: #ff9800 !important;
            box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.2) !important;
          }
          
          /* Pulse animation for attention */
          @keyframes pulse-orange {
            0%, 100% {
              box-shadow: 0 4px 15px rgba(255, 152, 0, 0.5);
            }
            50% {
              box-shadow: 0 4px 25px rgba(255, 152, 0, 0.8);
            }
          }
          
          #bp-web-widget-container button[aria-label="Toggle chat window"],
          #bp-web-widget-container .bpw-widget-btn {
            animation: pulse-orange 2s infinite;
          }
        `;
        
        // Remove existing custom styles if any
        const existingStyle = document.getElementById('botpress-custom-styles');
        if (existingStyle) {
          existingStyle.remove();
        }
        
        document.head.appendChild(style);
      }
    }, 100);

    // Cleanup after 10 seconds if not found
    setTimeout(() => clearInterval(checkBotpress), 10000);

    return () => {
      clearInterval(checkBotpress);
      const style = document.getElementById('botpress-custom-styles');
      if (style) {
        style.remove();
      }
    };
  }, []);

  return null;
}
