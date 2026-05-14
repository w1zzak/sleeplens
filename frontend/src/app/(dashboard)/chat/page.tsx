'use client';

import React, { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';
import { ChatMessage, ChatResponse, ChatHistoryResponse } from '@/types/ai';
import { ChatBubble } from '@/components/ai/ChatBubble';
import { ChatInput } from '@/components/ai/ChatInput';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsFetchingHistory(true);
        const history = await api<ChatMessage[]>('/ai/history');
        
        if (history.length === 0) {
          // Mensaje de bienvenida inicial si no hay historial
          setMessages([
            {
              role: 'assistant',
              content: '¡Hola! Soy SleepLens AI. He analizado tus registros de sueño recientes. ¿En qué te puedo ayudar hoy para mejorar tu descanso?'
            }
          ]);
        } else {
          setMessages(history);
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setIsFetchingHistory(false);
      }
    };
    
    fetchHistory();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Añadir mensaje del usuario a la UI instantáneamente
    const userMessage: ChatMessage = { role: 'user', content, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Enviar al backend
      const response = await api<string>('/ai/chat', {
        method: 'POST',
        data: { message: content }
      });

      // Añadir respuesta de la IA a la UI
      const aiMessage: ChatMessage = { 
        role: 'assistant', 
        content: response,
        createdAt: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Opcional: mostrar un toast o mensaje de error en la UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] md:h-[calc(100vh-theme(spacing.8))] max-h-[800px] bg-obsidian-surface/50 rounded-2xl border border-sleep-border overflow-hidden shadow-xl mx-4 md:mx-8 mb-8 mt-2 relative">
      
      {/* Header */}
      <div className="bg-obsidian-card border-b border-sleep-border p-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-light"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-primary leading-tight">SleepLens AI</h1>
            <p className="text-xs text-slate-muted flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Conectado y analizando
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar scroll-smooth">
        {isFetchingHistory ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-muted">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm">Cargando memoria...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((msg, index) => (
              <ChatBubble key={msg.id || index} message={msg} />
            ))}
            
            {isLoading && (
              <div className="flex w-full mb-6 justify-start">
                <div className="bg-obsidian-card border border-sleep-border rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent-light">SleepLens AI</span>
                  </div>
                  <div className="flex gap-1 items-center h-5">
                    <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-accent/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading || isFetchingHistory} />
    </div>
  );
}
