import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <div className="bg-obsidian-surface border-t border-sleep-border p-4 sticky bottom-0 z-10 w-full">
      <div className="max-w-4xl mx-auto flex gap-3 items-end bg-obsidian-card border border-sleep-border rounded-2xl p-2 focus-within:ring-1 focus-within:ring-accent transition-all shadow-lg">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Pregúntale a SleepLens AI sobre tus patrones..."
          className="flex-1 bg-transparent border-none text-slate-primary placeholder:text-slate-muted resize-none py-3 px-4 focus:outline-none focus:ring-0 max-h-[120px] custom-scrollbar text-sm"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="p-3 bg-accent text-white rounded-xl hover:bg-accent-light focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-obsidian-card disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
          aria-label="Enviar mensaje"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
      <div className="text-center mt-2">
        <span className="text-[10px] text-slate-muted">SleepLens AI puede cometer errores. Verifica la información.</span>
      </div>
    </div>
  );
};
