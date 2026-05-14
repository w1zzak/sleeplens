import React from 'react';
import { ChatMessage } from '@/types/ai';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-5 py-4 shadow-sm ${
          isUser 
            ? 'bg-accent text-white rounded-tr-sm' 
            : 'bg-obsidian-card border border-sleep-border text-slate-primary rounded-tl-sm'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-semibold uppercase tracking-wider ${isUser ? 'text-white/80' : 'text-accent-light'}`}>
            {isUser ? 'Tú' : 'SleepLens AI'}
          </span>
          {message.createdAt && (
            <span className="text-[10px] text-slate-muted">
              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        
        <div className="text-sm md:text-base leading-relaxed space-y-2">
          {message.content.split('\n').map((line, i) => (
            line.trim() ? <p key={i}>{line}</p> : <br key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
