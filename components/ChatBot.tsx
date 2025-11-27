import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { createMunicipalChat } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { GenerateContentResponse } from '@google/genai';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '0', 
      role: 'model', 
      text: "Bonjour ! Je suis AlbyBot, l'assistant virtuel de la mairie d'Alby-sur-Chéran. Comment puis-je vous aider aujourd'hui ? (État civil, événements, forum...)" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Use ref to persist chat session across renders
  const chatSessionRef = useRef<any>(null);

  useEffect(() => {
    if (!chatSessionRef.current) {
      chatSessionRef.current = createMunicipalChat();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const result = await chatSessionRef.current.sendMessageStream({
        message: userMsg.text
      });

      let fullResponse = "";
      const botMsgId = (Date.now() + 1).toString();

      // Optimistically add the bot message container
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        isTyping: true
      }]);

      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text;
        if (text) {
          fullResponse += text;
          
          setMessages(prev => prev.map(msg => 
            msg.id === botMsgId 
              ? { ...msg, text: fullResponse, isTyping: true }
              : msg
          ));
        }
      }
      
      // Finalize message
      setMessages(prev => prev.map(msg => 
        msg.id === botMsgId 
          ? { ...msg, isTyping: false }
          : msg
      ));

    } catch (error) {
      console.error("Chat Error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "Désolé, je rencontre des difficultés techniques. Veuillez contacter la mairie par téléphone."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* FAB */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-lg transition-all transform hover:scale-105 ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 bg-amber-700 text-white'
        }`}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 transition-all duration-300 transform origin-bottom-right flex flex-col ${
        isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'
      }`} style={{ height: '500px', maxHeight: '80vh' }}>
        
        {/* Header */}
        <div className="bg-amber-800 p-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">AlbyBot</h3>
              <p className="text-xs text-amber-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                En ligne
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-amber-700 text-white rounded-br-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                }`}
              >
                {msg.role === 'model' ? (
                  <div className="prose prose-sm prose-amber max-w-none prose-p:my-1 prose-ul:my-1">
                    <ReactMarkdown>
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          {isTyping && messages[messages.length - 1]?.role === 'user' && (
             <div className="flex justify-start">
                <div className="bg-white text-slate-500 border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                   <Loader2 size={16} className="animate-spin" />
                   <span className="text-xs">AlbyBot écrit...</span>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-slate-100 shrink-0">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Posez votre question..."
              className="w-full pl-4 pr-12 py-3 bg-slate-100 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition"
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="absolute right-2 p-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Send size={16} />
            </button>
          </div>
          <div className="text-center mt-2">
             <p className="text-[10px] text-slate-400">L'IA peut faire des erreurs. Vérifiez les infos importantes.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;