'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    chatbase: any;
  }
}

export function ChatbaseProvider() {
  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.id = 'REDACTED';
    
    // Initialize Chatbase configuration
    window.chatbase = function() {
      // @ts-ignore
      if (!window.chatbase.q) window.chatbase.q = [];
      // @ts-ignore
      window.chatbase.q.push(arguments);
    };

    // Configure initial options
    const config = {
      chatbotId: 'REDACTED',
      domain: 'www.chatbase.co',
      iframe: true,
      embedOptions: {
        requireEmail: false,
        REDACTED: true,
        chatTitle: 'Jazeera Airways API Assistant',
        welcomeMessage: 'Hello! How can I help you with the Jazeera Airways API today?'
      }
    };

    script.setAttribute('chatbase-id', config.chatbotId);
    script.setAttribute('domain', config.domain);
    script.setAttribute('options', JSON.stringify(config.embedOptions));
    
    // Handle bot responses and inject feedback
    window.addEventListener('message', (event) => {
      if (event.data.type === 'chatbase:botResponse') {
        console.log('Bot responded:', event.data);
        
        // Wait a short moment before asking for feedback
        setTimeout(() => {
          window.chatbase('sendMessage', {
            message: 'Was this answer helpful?',
            buttons: [
              { text: 'Yes', value: 'yes', action: 'feedback_yes' },
              { text: 'No', value: 'no', action: 'feedback_no' }
            ]
          });
        }, 1000);
      }
      
      // Handle feedback button clicks
      if (event.data.type === 'chatbase:buttonClick') {
        const action = event.data.data?.action;
        if (action === 'feedback_yes') {
          window.chatbase('sendMessage', {
            message: 'Great! Do you have any other questions?'
          });
        } else if (action === 'feedback_no') {
          window.chatbase('sendMessage', {
            message: 'Would you like to reach out to our API support team?'
          });
        }
      }

      // Handle chat toggle (open/close)
      if (event.data.type === 'chatbase:toggle') {
        console.log('Chat toggled:', event.data);
      }
    });

    // Add the script to the DOM
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      document.getElementById('REDACTED')?.remove();
      const iframe = document.querySelector('iframe[src*="chatbase"]');
      if (iframe) {
        iframe.remove();
      }
    };
  }, []);

  return null;
}

