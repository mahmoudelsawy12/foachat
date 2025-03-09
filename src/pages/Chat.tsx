import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Mic, Loader2 } from 'lucide-react';
import NavBar from '../components/NavBar';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

function Chat() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hello! I\'m your FOA Chat AI assistant. How can I help you today?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { error: 'Please login to access the chat' } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsProcessing(true);

    // Add user message to chat
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);

    try {
      // Get response from local database or Gemini API
      const result = await api.getChatResponse(userMessage);
      
      // Add bot response to chat
      setMessages(prev => [...prev, { sender: 'bot', text: result.response }]);
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Sorry, I encountered an error processing your request. Please try again.' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0B1E] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B1E] flex flex-col">
      {/* Navigation */}
      <NavBar />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="w-64 bg-[#1A1B2E]/50 p-4 border-r border-gray-800 hidden md:block">
          <h1 className="text-2xl font-bold text-white mb-6">Tanta University</h1>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#0A0B1E] text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
            />
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-gray-400 mb-2">Recent Conversations</h2>
              {[
                'Research paper on AI ethics',
                'Help with calculus homework',
                'Literature review tips',
                'Study plan for finals',
                'Career advice for CS majors',
                'Thesis statement feedback'
              ].map((topic, i) => (
                <button
                  key={i}
                  className="w-full text-left text-gray-400 hover:text-white bg-[#0A0B1E] rounded-lg px-4 py-2 transition mb-1 truncate"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-lg rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#1A1B2E] text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-[#1A1B2E] text-white rounded-lg px-4 py-2 flex items-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-800 p-4 bg-[#1A1B2E]/50">
            <div className="flex items-center space-x-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 bg-[#0A0B1E] text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500 resize-none"
                rows={1}
                disabled={isProcessing}
              />
              <button
                onClick={() => {}}
                className="p-2 text-gray-400 hover:text-white transition"
                disabled={isProcessing}
              >
                <Mic className="w-6 h-6" />
              </button>
              <button
                onClick={handleSend}
                className={`p-2 ${isProcessing ? 'text-gray-500' : 'text-purple-500 hover:text-purple-400'} transition`}
                disabled={isProcessing}
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;