'use client';

import React from 'react';
import { SleepLog } from '@/types/sleep';

interface SleepLogListProps {
  logs: SleepLog[];
  onDelete?: (id: string) => void;
}

export const SleepLogList: React.FC<SleepLogListProps> = ({ logs, onDelete }) => {
  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-slate-muted bg-obsidian-surface/50 rounded-2xl border border-sleep-border border-dashed">
        <p>No tienes registros de sueño aún.</p>
        <p className="text-sm mt-1">Completa el formulario para empezar a trackear.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-primary mb-4">Historial Reciente</h2>
      {logs.map((log) => (
        <div key={log.id} className="bg-obsidian-surface p-4 rounded-xl border border-sleep-border flex justify-between items-center transition-all hover:border-accent/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-semibold text-slate-primary">
                {new Date(log.bedtime).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
              <span className="text-xs px-2 py-1 bg-accent/20 text-accent-light rounded-full font-medium">
                Calidad: {log.quality}/5
              </span>
            </div>
            <p className="text-sm text-slate-muted">
              {new Date(log.bedtime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} - {new Date(log.wakeTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              {log.duration && <span className="ml-2 font-medium">({log.duration}h)</span>}
            </p>
          </div>
          {onDelete && (
            <button 
              onClick={() => onDelete(log.id)}
              className="text-slate-muted hover:text-red-500 transition-colors p-2"
              title="Eliminar registro"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
