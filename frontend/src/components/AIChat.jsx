import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Trash2, Paperclip, Mic, StopCircle } from 'lucide-react';

const AIChat = ({ onSendMessage, isLoading, messages }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickSuggestions = [
    "Analyze BF-01 cooling system",
    "Check safety protocols for descaling",
    "Show maintenance history",
    "Predict next failure",
    "Generate maintenance report"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (!isLoading) {
      onSendMessage(suggestion);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Bot className="text-white w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white">Maintenance Assistant</h3>
              <p className="text-xs text-blue-100">Powered by Multi-Agent AI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-white">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gradient-to-b from-slate-900/50 to-slate-950/30">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <Sparkles className="text-white w-8 h-8" />
              </div>
              <h4 className="font-bold text-white text-lg mb-2">How can I help you today?</h4>
              <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                I'm your AI maintenance assistant, powered by specialized agents. Ask me anything about your equipment!
              </p>
              
              {/* Quick Suggestions */}
              <div className="flex flex-wrap gap-2 justify-center">
                {quickSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-600 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  {message.role === 'user' ? (
                    <User className="text-white w-5 h-5" />
                  ) : (
                    <Bot className="text-white w-5 h-5" />
                  )}
                </div>
                <div className={`max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-sm'
                      : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <span className="text-xs text-slate-500 px-1">
                    {message.timestamp?.toLocaleTimeString() || new Date().toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))
          )}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Bot className="text-white w-5 h-5" />
              </div>
              <div className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1.5">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-slate-800/50 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <button
            type="button"
            className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white rounded-xl transition-all"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white rounded-xl transition-all"
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about maintenance, safety, or equipment..."
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition-all"
            disabled={isLoading}
          />
          {isLoading ? (
            <button
              type="button"
              className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all"
            >
              <StopCircle className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AIChat;
