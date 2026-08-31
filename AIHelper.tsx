/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { ChatMessage } from '../types';

interface AIHelperProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProduct: (id: string) => void;
}

export default function AIHelper({ isOpen, onClose, onNavigateToProduct }: AIHelperProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Greetings. I am **AERA**, your high-fidelity, cyber-engineered shopping assistant at AETHERON Laboratories. I can assist you in finding elite smartphones, comparing specs, applying cyber coupons, or tracking active shipments. Speak to me.',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPhrase, setLoadingPhrase] = useState('Processing signals...');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const loaderPhrases = [
    'Scanning store inventory...',
    'Decrypting neural pathways...',
    'Interpreting processor bands...',
    'Applying cyber calibration...',
    'Sourcing elite metrics...'
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    if (!customText) setInput('');

    const userMsg: ChatMessage = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Dynamic phrasing cycle for fun loading states
    let phraseIdx = 0;
    const interval = setInterval(() => {
      setLoadingPhrase(loaderPhrases[phraseIdx % loaderPhrases.length]);
      phraseIdx++;
    }, 1200);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history: messages })
      });

      const data = await response.json();
      clearInterval(interval);

      const aiMsg: ChatMessage = {
        id: 'msg-' + Math.random().toString(36).substring(2, 9),
        sender: 'ai',
        text: data.response || 'Encryption loop closed. Repeat transmission.',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      clearInterval(interval);
      const errorMsg: ChatMessage = {
        id: 'msg-' + Math.random().toString(36).substring(2, 9),
        sender: 'ai',
        text: 'System alert: Connection timeout. The underlying AETHERON server node appears transiently occupied. Try again.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickChips = [
    'Recommend gaming smartphones',
    'Compare Apple vs ROG',
    'What is the highest camera test?',
    'What are the active coupons?',
    'Track my order AETH-9284'
  ];

  // Helper to parse Markdown bold markers **text** into JSX bold tags safely
  const formatMessageText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-emerald-400 font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-105 bg-black/95 border-l border-emerald-950/60 shadow-2xl z-50 flex flex-col backdrop-blur-lg">
      
      {/* Header element with cyberpunk design */}
      <div className="p-4 border-b border-emerald-950/40 bg-zinc-950/80 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center animate-pulse">
            <Bot className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-mono text-sm font-bold text-white tracking-widest uppercase flex items-center space-x-1">
              <span>AERA SHOPPING AI</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </h4>
            <p className="font-mono text-[9px] text-[#03f47c]/80 truncate">UNIT-3.5 CONNECTED LIVE</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-850 text-zinc-500 hover:text-white transition-all outline-none"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`flex flex-col max-w-[85%] ${
              m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div 
              className={`p-3 rounded-xl border text-xs whitespace-pre-wrap leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 rounded-br-none'
                  : 'bg-zinc-950/80 border-zinc-900 text-zinc-300 rounded-bl-none shadow'
              }`}
            >
              {formatMessageText(m.text)}
            </div>
            <span className="font-mono text-[8px] text-zinc-600 mt-1">{m.timestamp}</span>
          </div>
        ))}
        {loading && (
          <div className="flex flex-col max-w-[85%] mr-auto items-start">
            <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-900 flex items-center space-x-2 rounded-bl-none">
              <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">{loadingPhrase}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 bg-zinc-950/40 border-t border-emerald-950/10">
        <p className="font-mono text-[9px] text-zinc-600 uppercase mb-1.5">Direct Query suggestions</p>
        <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
          {quickChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(chip)}
              className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white font-mono text-[9px] border border-zinc-800 uppercase hover:border-emerald-950 transition-colors cursor-pointer outline-none text-left truncate max-w-full"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Footer input form */}
      <div className="p-4 border-t border-emerald-950/40 bg-zinc-950/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex space-x-2"
        >
          <input
            type="text"
            placeholder="COMMUNICATION INPUT..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-black border border-emerald-950 hover:border-emerald-900 rounded-xl px-4 py-2.5 text-xs text-white font-mono uppercase tracking-wider outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 hover:border-emerald-500 text-emerald-400 flex items-center justify-center transition-all disabled:opacity-30 disabled:hover:bg-emerald-950 disabled:hover:border-emerald-500/50"
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
        <div className="mt-2 flex items-center space-x-1 justify-center text-[9px] text-zinc-600 font-mono uppercase">
          <AlertCircle className="w-3 h-3 text-emerald-600" />
          <span>Calculated responses powered by Google Gemini-3.5-flash AI model.</span>
        </div>
      </div>

    </div>
  );
}
