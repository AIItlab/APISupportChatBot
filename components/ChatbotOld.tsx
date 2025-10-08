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

const getRelevantAnswer = (question: string): string | null => {
  const faqs = [
    {
      q: ['authentication', 'auth', 'login', 'credentials'],
      a: 'To authenticate with the Jazeera Airways API, you\'ll need to include your API key in the Authorization header. Contact support for your API credentials.'
    },
    {
      q: ['endpoint', 'api', 'route', 'url'],
      a: 'Our API endpoints are documented in detail. The base URL is api.jazeeraairways.com/v1. What specific endpoint are you interested in?'
    },
    {
      q: ['error', 'problem', 'issue', 'debug'],
      a: 'If you\'re experiencing issues, please check your request format and authentication. For specific error codes and troubleshooting, refer to our documentation.'
    },
    {
      q: ['integration', 'implement', 'setup', 'configure'],
      a: 'For integration, start by obtaining your API credentials, then follow our step-by-step guide in the documentation. Would you like specific integration steps?'
    }
  ];

  const normalizedQuestion = question.toLowerCase();
  for (const faq of faqs) {
    if (faq.q.some(keyword => normalizedQuestion.includes(keyword))) {
      return faq.a;
    }
  }
  return null;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'assistant',
    content: 'Welcome! How can I help you with the Jazeera Airways API today?'
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSatisfactionResponse = (satisfied: boolean, index: number) => {
    const updatedMessages = [...messages];
    updatedMessages[index].needsFeedback = false;
    updatedMessages.push({
      role: 'user',
      content: satisfied ? "Yes, that was helpful" : "No, I need more help"
    });

    if (!satisfied) {
      updatedMessages.push({
        role: 'assistant',
        content: "I'm sorry the answer wasn't helpful. Could you please rephrase your question or provide more details so I can better assist you?",
        needsFeedback: true
      });
    }

    setMessages(updatedMessages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const faqResponse = getRelevantAnswer(userMessage);
      if (faqResponse) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: faqResponse,
          needsFeedback: true
        }]);
        setIsLoading(false);
        return;
      }

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
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.text,
        needsFeedback: !result.escalated
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'error',
          content: 'Sorry, I encountered an error. Please try again later.',
          needsFeedback: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          className="fixed bottom-4 right-4 h-14 px-6 shadow-lg bg-blue-600 hover:bg-blue-700 flex items-center gap-2 rounded-full animate-bounce-subtle transition-all duration-300 border-2 border-white/20"
        >
          <MessageCircle className="h-6 w-6 text-white" />
          <span className="text-white font-medium">Chat with us</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:max-w-[400px] h-[100vh] flex flex-col">
        <SheetHeader>
          <SheetTitle>Jazeera Airways FAQ Assistant</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i}>
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-jazeera-blue text-white'
                    : msg.role === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
              {msg.needsFeedback && (
                <div className="mt-2">
                  <p className="text-sm text-center text-gray-500">Was this answer helpful?</p>
                  <SatisfactionCheck onResponse={(satisfied) => handleSatisfactionResponse(satisfied, i)} />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <p className="text-sm text-gray-500">Typing...</p>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 p-2 border rounded-md"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="bg-jazeera-blue hover:bg-jazeera-blue/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
