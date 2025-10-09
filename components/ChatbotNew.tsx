'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { MessageCircle, Send, Bot, User, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { z } from 'zod';

const chatResponseSchema = z.object({
  text: z.string(),
  escalated: z.boolean(),
  error: z.string().optional(),
  details: z.string().optional(),
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'error' | 'satisfaction-check';
  content: string;
  needsFeedback?: boolean;
  timestamp: Date;
  id: string;
}

const SatisfactionCheck = ({ onResponse }: { onResponse: (satisfied: boolean) => void }) => (
  <div className="flex items-center justify-center gap-3 my-3 p-2 bg-gray-50 rounded-lg">
    <span className="text-sm text-gray-600">Was this helpful?</span>
    <div className="flex gap-2">
      <Button
        onClick={() => onResponse(true)}
        size="sm"
        variant="secondary"
        className="text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
      >
        <ThumbsUp className="h-3 w-3 mr-1" />
        Yes
      </Button>
      <Button
        onClick={() => onResponse(false)}
        size="sm"
        variant="secondary"
        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
      >
        <ThumbsDown className="h-3 w-3 mr-1" />
        No
      </Button>
    </div>
  </div>
);

// Enhanced message formatting function
const formatMessage = (content: string) => {
  // Split by double newlines for paragraphs
  const paragraphs = content.split('\n\n');
  
  return paragraphs.map((paragraph, index) => {
    // Handle bullet points
    if (paragraph.includes('•') || paragraph.includes('-')) {
      const lines = paragraph.split('\n');
      return (
        <div key={index} className="mb-3">
          {lines.map((line, lineIndex) => {
            if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
              return (
                <div key={lineIndex} className="flex items-start gap-2 mb-1">
                  <span className="text-jazeera-blue mt-1">•</span>
                  <span className="flex-1">{line.replace(/^[•-]\s*/, '')}</span>
                </div>
              );
            }
            return line && <div key={lineIndex} className="mb-2 font-medium">{line}</div>;
          })}
        </div>
      );
    }
    
    // Handle numbered lists
    if (/^\d+\./.test(paragraph.trim())) {
      const lines = paragraph.split('\n');
      return (
        <div key={index} className="mb-3">
          {lines.map((line, lineIndex) => {
            const numberedMatch = line.match(/^(\d+)\.\s*(.+)/);
            if (numberedMatch) {
              return (
                <div key={lineIndex} className="flex items-start gap-2 mb-1">
                  <span className="text-jazeera-blue font-semibold min-w-[1.5rem]">{numberedMatch[1]}.</span>
                  <span className="flex-1">{numberedMatch[2]}</span>
                </div>
              );
            }
            return line && <div key={lineIndex}>{line}</div>;
          })}
        </div>
      );
    }
    
    // Handle code snippets (content in quotes or containing API-specific terms)
    if (paragraph.includes('"') && (paragraph.includes('API') || paragraph.includes(':'))) {
      return (
        <div key={index} className="mb-3">
          <pre className="bg-gray-100 p-3 rounded-md text-sm font-mono whitespace-pre-wrap border-l-4 border-jazeera-blue">
            {paragraph}
          </pre>
        </div>
      );
    }
    
    // Handle headers (lines with **text**)
    const headerMatch = paragraph.match(/\*\*(.+?)\*\*/);
    if (headerMatch) {
      return (
        <div key={index} className="mb-3">
          <h4 className="font-semibold text-jazeera-blue mb-2">{headerMatch[1]}</h4>
          {paragraph.replace(/\*\*(.+?)\*\*/, '').trim() && (
            <p>{paragraph.replace(/\*\*(.+?)\*\*/, '').trim()}</p>
          )}
        </div>
      );
    }
    
    // Regular paragraphs
    return paragraph && (
      <p key={index} className="mb-3 leading-relaxed">
        {paragraph}
      </p>
    );
  });
};

// Helper function to create new message
const createMessage = (role: ChatMessage['role'], content: string, needsFeedback = false): ChatMessage => ({
  role,
  content,
  needsFeedback,
  timestamp: new Date(),
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
});

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage('assistant', '👋 Hello! I\'m your Jazeera Airways API assistant. I can help you with booking, payments, authentication, and more. What would you like to know?')
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSatisfactionResponse = async (satisfied: boolean, messageIndex: number) => {
    const updatedMessages = [...messages];
    updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], needsFeedback: false };

    if (!satisfied) {
      // Add user feedback message
      updatedMessages.push(createMessage('user', 'No, I need more help'));
      
      // Add assistant follow-up
      updatedMessages.push(createMessage(
        'assistant', 
        "I'm sorry the answer wasn't helpful. Could you please rephrase your question or provide more details so I can better assist you? You can also email our support team directly for personalized help.",
        true
      ));
    } else {
      // Add positive feedback message
      updatedMessages.push(createMessage('user', 'Yes, that was helpful! 👍'));
    }

    setMessages(updatedMessages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, createMessage('user', userMessage)]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: userMessage,
          userEmail: 'user@example.com'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const result = await response.json();
      setMessages(prev => [...prev, createMessage('assistant', result.text, !result.escalated)]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        createMessage('error', 'Sorry, I encountered an error. Please try again later.', true)
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-jazeera-blue hover:bg-jazeera-blue/90 shadow-lg transition-all duration-200 hover:scale-105"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[400px] sm:w-[500px] p-0 flex flex-col h-full">
        <SheetHeader className="p-6 pb-4 border-b bg-gradient-to-r from-jazeera-blue to-blue-600">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <SheetTitle className="text-white text-lg font-semibold">
                Jazeera Airways API Assistant
              </SheetTitle>
              <p className="text-white/80 text-sm">Get instant help with API documentation</p>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div key={msg.id}>
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                {msg.role !== 'user' && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'error' ? 'bg-red-100' : 'bg-jazeera-blue'
                  }`}>
                    <Bot className={`h-4 w-4 ${msg.role === 'error' ? 'text-red-600' : 'text-white'}`} />
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-jazeera-blue text-white'
                    : msg.role === 'error'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                }`}>
                  <div className="text-sm">
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        {formatMessage(msg.content)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs opacity-70 mt-2">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
              
              {msg.needsFeedback && (
                <div className="mt-3 ml-10">
                  <SatisfactionCheck onResponse={(satisfied) => handleSatisfactionResponse(satisfied, i)} />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start gap-2">
              <div className="w-8 h-8 rounded-full bg-jazeera-blue flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="border-t bg-white p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about the Jazeera Airways API..."
              className="flex-1 p-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-jazeera-blue focus:border-transparent resize-none"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="bg-jazeera-blue hover:bg-jazeera-blue/90 h-12 w-12 rounded-2xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 px-1">
            Press Enter to send • I can help with API documentation and troubleshooting
          </p>
        </form>
      </SheetContent>
    </Sheet>
  );
}
