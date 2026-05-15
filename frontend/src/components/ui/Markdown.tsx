import React from 'react';

interface MarkdownProps {
  text: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ text }) => {
  const renderBold = (line: string) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderLine = (line: string, index: number) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      return <h2 key={index} className="text-xl font-bold text-accent-light mt-6 mb-3">{trimmed.replace('## ', '')}</h2>;
    }
    if (trimmed.startsWith('# ')) {
      return <h1 key={index} className="text-2xl font-bold text-accent mt-6 mb-4">{trimmed.replace('# ', '')}</h1>;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const content = trimmed.substring(2);
      return <li key={index} className="ml-4 mb-2 text-slate-primary list-disc">{renderBold(content)}</li>;
    }
    if (trimmed === '') {
      return <div key={index} className="h-2"></div>;
    }
    return <p key={index} className="mb-2 text-slate-primary leading-relaxed">{renderBold(line)}</p>;
  };

  return (
    <div className="w-full">
      {text.split('\n').map(renderLine)}
    </div>
  );
};
