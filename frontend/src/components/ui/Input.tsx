import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-muted">
          {label}
        </label>
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg bg-obsidian-surface border 
            focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-200
            text-slate-primary placeholder-slate-muted/50
            ${error ? 'border-red-500 focus:border-red-500' : 'border-sleep-border hover:border-slate-muted/50 focus:border-accent'}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
