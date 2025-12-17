'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageCircle, X, Sparkles } from 'lucide-react';
import { api } from '@/lib/api-client';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  isTyping?: boolean;
}

interface ChatProps {
  diagnosisId: number;
  onClose: () => void;
}

export function ChatWithDiagnosis({ diagnosisId, onClose }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const typeMessage = (text: string, suggestions: string[]) => {
    const words = text.split(' ');
    let currentIndex = 0;
    setTypingText('');
    
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: '',
      isTyping: true
    }]);

    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < words.length) {
        const newText = words.slice(0, currentIndex + 1).join(' ');
        setTypingText(newText);
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = newText;
          return newMessages;
        });
        currentIndex++;
      } else {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].isTyping = false;
          newMessages[newMessages.length - 1].suggestions = suggestions;
          return newMessages;
        });
      }
    }, 30);
  };

  const sendMessage = async (message?: string) => {
    const userMessage = (message || input).trim();
    if (!userMessage || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const data = await api.chatWithDiagnosis(diagnosisId.toString(), userMessage);
      
      const suggestions = [
        "Can you explain this in simpler terms?",
        "What are the next steps?",
        "Are there any side effects?"
      ];
      
      setLoading(false);
      typeMessage(data.response, suggestions);
    } catch (error) {
      setLoading(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-zinc-900/95 backdrop-blur-xl rounded-xl shadow-2xl flex flex-col border border-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/50 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Clinical AI Consultant</h3>
            <p className="text-xs text-white/60">AI-Assisted Clinical Decision Support</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition flex items-center justify-center"
          title="Close chat"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-zinc-400 mt-8">
            <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-sm">Clinical consultation and case discussion</p>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => sendMessage("What are the recommended tests?")}
                className="w-full text-left px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-300 transition"
              >
                💉 What investigations are indicated?
              </button>
              <button
                onClick={() => sendMessage("What is the treatment plan?")}
                className="w-full text-left px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-300 transition"
              >
                💊 What is the management approach?
              </button>
              <button
                onClick={() => sendMessage("What lifestyle changes should I make?")}
                className="w-full text-left px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-zinc-300 transition"
              >
                🏃 What are the clinical considerations?
              </button>
            </div>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx}>
            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] p-4 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'bg-zinc-800 text-white border border-zinc-700'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="mb-2" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
              </div>
            </div>
            {msg.role === 'assistant' && msg.suggestions && !msg.isTyping && (
              <div className="mt-2 ml-2 space-y-1">
                {msg.suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(suggestion)}
                    className="block text-left px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition border border-zinc-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 border border-zinc-700 p-3 rounded-xl">
              <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 rounded-b-xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Clinical question or consultation..."
            className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-800 text-zinc-50 placeholder:text-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
