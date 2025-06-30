
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message as MessageType, User } from '../types';
import { getAiResponse } from '../services/geminiService';
import Message from './Message';
import { SendIcon } from './Icons';

interface ChatInterfaceProps {
  user: User;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial welcome message from the AI
    setMessages([
      {
        id: 'initial-ai-message',
        text: `Hi ${user.displayName || 'there'}! What's one thing that made you smile today? 😄`,
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  }, [user.displayName]);

  const handleSend = useCallback(async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: MessageType = {
      id: `user-${Date.now()}`,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponse = await getAiResponse(userMessage.text, messages);

    const aiMessage: MessageType = {
      id: `ai-${Date.now()}`,
      text: aiResponse.conversationResponse,
      sender: 'ai',
      correction: aiResponse.correction,
      originalText: userMessage.text, // Store user's text for the share feature
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  }, [input, isLoading, messages]);

  return (
    <div className="flex flex-col flex-grow w-full max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-xl h-[calc(100vh-80px)] overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
              <div className="bg-gray-700 rounded-2xl p-3 max-w-lg">
                  <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-75"></div>
                      <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-150"></div>
                  </div>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-800/70 border-t border-gray-700">
        <form onSubmit={handleSend} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message in English..."
            disabled={isLoading}
            className="flex-1 w-full p-3 bg-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full text-white hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
