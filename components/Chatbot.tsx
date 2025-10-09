'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
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
  needsSupportContact?: boolean;
  userQuestion?: string;
  timestamp: Date;
  id: string;
}

const SatisfactionCheck = ({ onResponse }: { onResponse: (satisfied: boolean) => void }) => (
  <div className="flex items-center justify-center gap-4 my-4 p-4 bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 rounded-2xl border border-slate-200/60 shadow-sm backdrop-blur-sm">
    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
      <span className="text-lg">✨</span>
      <span>Was this helpful?</span>
    </span>
    <div className="flex gap-3">
      <Button
        onClick={() => onResponse(true)}
        size="sm"
        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg px-4 py-2 rounded-xl font-medium"
      >
        <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
        Yes
      </Button>
      <Button
        onClick={() => onResponse(false)}
        size="sm"
        className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg px-4 py-2 rounded-xl font-medium"
      >
        <ThumbsDown className="h-3.5 w-3.5 mr-1.5" />
        No
      </Button>
    </div>
  </div>
);

const SupportContactCheck = ({ onResponse, isLoading }: { onResponse: (contactSupport: boolean) => void, isLoading: boolean }) => (
  <div className="flex flex-col items-center justify-center gap-4 my-4 p-4 bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 rounded-2xl border border-slate-200/60 shadow-sm backdrop-blur-sm">
    <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
      <span className="text-lg">📞</span>
      <span>Would you like personalized assistance from our support team?</span>
    </span>
    <div className="flex gap-3 mt-2">
      <Button
        onClick={() => onResponse(true)}
        size="sm"
        disabled={isLoading}
        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg px-4 py-2 rounded-xl font-medium"
      >
        <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
        Yes
      </Button>
      <Button
        onClick={() => onResponse(false)}
        size="sm"
        disabled={isLoading}
        className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white border-0 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg px-4 py-2 rounded-xl font-medium"
      >
        <ThumbsDown className="h-3.5 w-3.5 mr-1.5" />
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
        <div key={index} className="mb-4">
          {lines.map((line, lineIndex) => {
            if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
              return (
                <div key={lineIndex} className="flex items-start gap-3 mb-2 p-2 bg-blue-50 rounded-lg">
                  <span className="text-jazeera-blue mt-1 font-bold">•</span>
                  <span className="flex-1 text-gray-800">{line.replace(/^[•-]\s*/, '')}</span>
                </div>
              );
            }
            return line && <div key={lineIndex} className="mb-2 font-semibold text-gray-900">{line}</div>;
          })}
        </div>
      );
    }
    
    // Handle numbered lists
    if (/^\d+\./.test(paragraph.trim())) {
      const lines = paragraph.split('\n');
      return (
        <div key={index} className="mb-4">
          {lines.map((line, lineIndex) => {
            const numberedMatch = line.match(/^(\d+)\.\s*(.+)/);
            if (numberedMatch) {
              return (
                <div key={lineIndex} className="flex items-start gap-3 mb-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-jazeera-blue">
                  <span className="text-jazeera-blue font-bold text-lg min-w-[2rem] flex items-center justify-center bg-white rounded-full w-8 h-8 shadow-sm">
                    {numberedMatch[1]}
                  </span>
                  <span className="flex-1 text-gray-800 font-medium">{numberedMatch[2]}</span>
                </div>
              );
            }
            return line && <div key={lineIndex} className="text-gray-800">{line}</div>;
          })}
        </div>
      );
    }
    
    // Handle code snippets (content in quotes or containing API-specific terms)
    if (paragraph.includes('"') && (paragraph.includes('API') || paragraph.includes(':'))) {
      return (
        <div key={index} className="mb-4">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap border-l-4 border-jazeera-blue shadow-lg">
            {paragraph}
          </pre>
        </div>
      );
    }
    
    // Handle headers (lines with **text**)
    const headerMatch = paragraph.match(/\*\*(.+?)\*\*/);
    if (headerMatch) {
      return (
        <div key={index} className="mb-4">
          <h4 className="font-bold text-jazeera-blue text-lg mb-3 pb-2 border-b-2 border-blue-100">{headerMatch[1]}</h4>
          {paragraph.replace(/\*\*(.+?)\*\*/, '').trim() && (
            <p className="text-gray-800 leading-relaxed">{paragraph.replace(/\*\*(.+?)\*\*/, '').trim()}</p>
          )}
        </div>
      );
    }
    
    // Regular paragraphs
    return paragraph && (
      <p key={index} className="mb-3 leading-relaxed text-gray-800">
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
  const [isSupportLoading, setIsSupportLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [hasProvidedEmail, setHasProvidedEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    
    if (!emailInput.trim()) {
      setEmailError('Please enter your email address');
      return;
    }
    
    if (!validateEmail(emailInput.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setUserEmail(emailInput.trim());
    setHasProvidedEmail(true);
    
    // Initialize welcome message after email is provided
    setMessages([
      createMessage('assistant', `👋 Hello! Thank you for providing your email (${emailInput.trim()}). I'm your Jazeera Airways API assistant. I can help you with booking, payments, authentication, and more. What would you like to know?`)
    ]);
  };

  const handleSatisfactionResponse = async (satisfied: boolean, messageIndex: number) => {
    const updatedMessages = [...messages];
    updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], needsFeedback: false };

    if (!satisfied) {
      // Add user feedback message
      updatedMessages.push(createMessage('user', 'No, I need more help'));
      
      // Add assistant follow-up with support contact option
      const followUpMessage = createMessage(
        'assistant', 
        "I'm sorry the answer wasn't helpful. I'd like to provide you with better assistance.",
        false
      );
      followUpMessage.needsSupportContact = true;
      followUpMessage.userQuestion = messages[messageIndex - 1]?.content || ''; // Store the user's question
      updatedMessages.push(followUpMessage);
    } else {
      // Add positive feedback message
      updatedMessages.push(createMessage('user', 'Yes, that was helpful! 👍'));
    }

    setMessages(updatedMessages);
  };

  const initialSupportFields = {
    apiUserId: '',
    organizationId: '',
    url: '',
    environment: '',
    paymentType: '',
  };
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportFields, setSupportFields] = useState(initialSupportFields);
  const [supportFormError, setSupportFormError] = useState('');

  // Track the indices of the escalated user question and bot response
  const [escalatedIndices, setEscalatedIndices] = useState<{ userIdx: number, botIdx: number } | null>(null);

  const handleSupportContactResponse = async (contactSupport: boolean, messageIndex: number) => {
    const updatedMessages = [...messages];
    updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], needsSupportContact: false };

    if (contactSupport) {
      // Find the user question and bot response that led to escalation
      // If the previous message is a feedback message (e.g., 'No, I need more help'), skip it
      let userIdx = -1, botIdx = -1;
      let i = messageIndex - 1;
      // Skip feedback message if present
      if (updatedMessages[i]?.role === 'user' && updatedMessages[i]?.content.trim().toLowerCase().includes('need more help')) {
        i--;
      }
      // Find the last user and assistant messages before escalation
      for (; i >= 0; i--) {
        if (updatedMessages[i].role === 'user' && userIdx === -1) userIdx = i;
        if (updatedMessages[i].role === 'assistant' && botIdx === -1) botIdx = i;
        if (userIdx !== -1 && botIdx !== -1) break;
      }
      setEscalatedIndices({ userIdx, botIdx });
      // Add user response
      updatedMessages.push(createMessage('user', 'Yes, please contact support team'));
      setMessages(updatedMessages);
      setShowSupportForm(true);
      return;
    } else {
      // User declined support contact
      updatedMessages.push(createMessage('user', 'No, don\'t contact support'));
      updatedMessages.push(createMessage(
        'assistant',
        "No problem! Feel free to ask me another question, or you can always contact our support team directly at spam.faq.test@gmail.com if you need further assistance.",
        false
      ));
      setMessages(updatedMessages);
    }
  };

  const handleSupportFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSupportFormError('');
    const { apiUserId, organizationId, url, environment, paymentType } = supportFields;
    if (!apiUserId || !organizationId || !url || !environment || !paymentType) {
      setSupportFormError('Please fill in all fields.');
      return;
    }
    setIsSupportLoading(true);
    try {
      // Send the full chat history (messages array) to the support API
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail,
          messages, // full chat history
          timestamp: new Date().toISOString(),
          apiUserId,
          organizationId,
          url,
          environment,
          paymentType,
        })
      });
      if (response.ok) {
        setMessages(prev => [...prev, createMessage(
          'assistant',
          "✅ Perfect! I've sent your conversation details to our support team. They will contact you directly at your email address within 24 hours to provide personalized assistance.",
          false
        )]);
        setShowSupportForm(false);
        setSupportFields(initialSupportFields);
      } else {
        throw new Error('Failed to contact support');
      }
    } catch (error) {
      setMessages(prev => [...prev, createMessage(
        'error',
        "❌ Sorry, there was an issue contacting our support team. Please try again later or email us directly at spam.faq.test@gmail.com",
        false
      )]);
    } finally {
      setIsSupportLoading(false);
    }
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
          userEmail: userEmail
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
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 shadow-2xl hover:shadow-3xl border-2 border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 group"
          size="icon"
        >
          <MessageCircle className="h-7 w-7 text-white transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-xs text-white font-bold">!</span>
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[420px] sm:w-[520px] p-0 flex flex-col h-full border-l border-slate-200/50 shadow-2xl">
        <SheetHeader className="p-6 pb-5 border-b border-slate-200/50 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <div className="relative flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg border border-white/20 backdrop-blur-sm">
              <Image 
                src="/chat-icon-img.png" 
                alt="Chatbot Icon" 
                width={56} 
                height={56} 
                className="rounded-2xl"
              />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-slate-800 text-xl font-bold tracking-tight leading-tight">
                Jazeera Airways API Assistant
              </SheetTitle>
              <p className="text-slate-600 text-sm font-medium mt-1 flex items-center gap-2">
                <span className="text-blue-500">✈️</span>
                Your intelligent co-pilot for API navigation
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400"></div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
          {!hasProvidedEmail ? (
            // Email Collection Form
            <div className="flex items-center justify-center h-full">
              <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-6">
                  <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-xl border border-white/20 backdrop-blur-sm">
                    <Image 
                      src="/chat-icon-img.png" 
                      alt="Chatbot Icon" 
                      width={88} 
                      height={88} 
                      className="rounded-3xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-slate-800 leading-tight">Welcome to Jazeera Airways</h3>
                    <h4 className="text-lg font-semibold text-blue-600">API Assistant</h4>
                    <p className="text-slate-600 text-sm leading-relaxed max-w-sm mx-auto">
                      To provide you with personalized support and enable seamless follow-up assistance, please enter your email address below.
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="your.email@example.com"
                      className={`w-full p-4 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 text-slate-800 placeholder-slate-400 shadow-sm bg-white/80 backdrop-blur-sm ${
                        emailError 
                          ? 'border-red-300 focus:ring-red-400/20 focus:border-red-500' 
                          : 'border-slate-200 focus:ring-blue-400/20 focus:border-blue-500'
                      }`}
                      required
                    />
                    {emailError && (
                      <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                        <span className="text-base">⚠️</span>
                        {emailError}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border border-white/20"
                  >
                    <span className="flex items-center justify-center gap-3">
                      <span className="text-lg">✈️</span>
                      Start Conversation
                    </span>
                  </Button>
                </form>
                
                <p className="text-xs text-slate-500 text-center leading-relaxed bg-slate-50/50 p-3 rounded-xl">
                  Your email will be used for support purposes and follow-up assistance. We respect your privacy and won't send you spam.
                </p>
              </div>
            </div>
          ) : (
            // Chat Messages
            <>
              {messages.map((msg, i) => (
            <div key={msg.id} className="group">
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3 mb-1`}>
                {msg.role !== 'user' && (
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md border border-white/30 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 ${
                    msg.role === 'error' 
                      ? 'bg-gradient-to-br from-red-500 to-rose-600' 
                      : 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600'
                  }`}>
                    <Image 
                      src="/chat-icon-img.png" 
                      alt="Chatbot Icon" 
                      width={36} 
                      height={36} 
                      className="rounded-2xl"
                    />
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-2xl px-5 py-4 shadow-sm transition-all duration-300 group-hover:shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white border border-blue-500/20 backdrop-blur-sm'
                    : msg.role === 'error'
                    ? 'bg-gradient-to-br from-red-50 to-rose-50 text-red-800 border border-red-200/60'
                    : 'bg-white/80 text-slate-800 border border-slate-200/60 backdrop-blur-sm'
                }`}>
                  <div className="text-sm leading-relaxed">
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        {formatMessage(msg.content)}
                      </div>
                    )}
                  </div>
                  <div className={`text-xs mt-3 pt-2 border-t transition-colors duration-300 ${
                    msg.role === 'user' 
                      ? 'text-blue-200 border-blue-400/30' 
                      : msg.role === 'error'
                      ? 'text-red-600/70 border-red-200/60'
                      : 'text-slate-500 border-slate-200/60'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {msg.role === 'user' && (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-600 to-gray-700 flex items-center justify-center flex-shrink-0 shadow-md border border-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-105">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              
              {msg.needsFeedback && (
                <div className="mt-4 ml-12">
                  <SatisfactionCheck onResponse={(satisfied) => handleSatisfactionResponse(satisfied, i)} />
                </div>
              )}
              
              {msg.needsSupportContact && (
                <div className="mt-4 ml-12">
                  <SupportContactCheck 
                    onResponse={(contactSupport) => handleSupportContactResponse(contactSupport, i)} 
                    isLoading={isSupportLoading}
                  />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md border border-white/30 backdrop-blur-sm">
                <Image 
                  src="/chat-icon-img.png" 
                  alt="Chatbot Icon" 
                  width={36} 
                  height={36} 
                  className="rounded-2xl"
                />
              </div>
              <div className="bg-white/80 rounded-2xl px-5 py-4 border border-slate-200/60 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-4 text-slate-600">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  <span className="text-sm font-medium">Thinking...</span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {showSupportForm && (
            <form onSubmit={handleSupportFormSubmit} className="space-y-4 bg-white/90 p-6 rounded-2xl border border-blue-200 shadow-lg mb-6">
              <h3 className="text-lg font-bold text-blue-700 mb-2">Contact Support - Additional Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <input type="text" placeholder="API User Id" value={supportFields.apiUserId} onChange={e => setSupportFields(f => ({ ...f, apiUserId: e.target.value }))} className="p-3 border rounded-xl" required />
                <input type="text" placeholder="Organization Id" value={supportFields.organizationId} onChange={e => setSupportFields(f => ({ ...f, organizationId: e.target.value }))} className="p-3 border rounded-xl" required />
                <input type="text" placeholder="URL" value={supportFields.url} onChange={e => setSupportFields(f => ({ ...f, url: e.target.value }))} className="p-3 border rounded-xl" required />
                <select value={supportFields.environment} onChange={e => setSupportFields(f => ({ ...f, environment: e.target.value }))} className="p-3 border rounded-xl" required>
                  <option value="">Select Environment</option>
                  <option value="Test">Test</option>
                  <option value="Prod">Prod</option>
                </select>
                <select value={supportFields.paymentType} onChange={e => setSupportFields(f => ({ ...f, paymentType: e.target.value }))} className="p-3 border rounded-xl" required>
                  <option value="">Select Payment Type</option>
                  <option value="AG">AG</option>
                  <option value="BSP">BSP</option>
                </select>
              </div>
              {supportFormError && <p className="text-red-600 text-sm">{supportFormError}</p>}
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl" disabled={isSupportLoading}>
                {isSupportLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : 'Submit to Support'}
              </Button>
            </form>
          )}
          <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {hasProvidedEmail && (
          <form onSubmit={handleSubmit} className="border-t border-slate-200/60 bg-white/80 backdrop-blur-sm p-5 shadow-lg">
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your Jazeera Airways API co-pilot anything..."
                className="flex-1 p-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-400/20 focus:border-blue-500 transition-all duration-300 text-slate-800 placeholder-slate-400 shadow-sm bg-white/80 backdrop-blur-sm"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-14 w-14 rounded-2xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 shadow-lg hover:shadow-xl border border-white/20 group"
              >
                <Send className="h-5 w-5 text-white transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-3 px-1 font-medium flex items-center gap-2">
              <span className="text-blue-500">✈️</span>
              Press Enter to send • Your intelligent co-pilot for seamless API navigation
            </p>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
