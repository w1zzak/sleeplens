'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { SleepLog } from '@/types/sleep';
import { SleepLogList } from '@/components/sleep/SleepLogList';

export default function HistoryPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const data = await api<SleepLog[]>(`/sleep/history?year=${year}&month=${month}`);
        setLogs(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
    setSelectedDay(null);
  };

  const getDaysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => {
    const day = new Date(y, m - 1, 1).getDay();
    // Ajustar para que la semana empiece en Lunes (0 = Lunes, 6 = Domingo)
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = currentDate.toLocaleString('es-ES', { month: 'long' });

  // Crear mapa de logs por día para fácil acceso
  const logsByDay = new Map<number, SleepLog>();
  logs.forEach(log => {
    const day = new Date(log.bedtime).getDate();
    logsByDay.set(day, log);
  });

  const filteredLogs = selectedDay
    ? logs.filter(log => new Date(log.bedtime).getDate() === selectedDay)
    : logs;

  const getQualityColor = (quality: number) => {
    if (quality >= 4) return 'bg-emerald-500 text-white';
    if (quality === 3) return 'bg-amber-500 text-white';
    if (quality <= 2) return 'bg-red-500 text-white';
    return 'bg-obsidian-surface text-slate-muted';
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-primary">Historial</h1>
        <p className="text-slate-muted mt-2">Explora tus patrones de sueño a lo largo del tiempo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendario */}
        <div className="bg-obsidian-card p-6 rounded-2xl border border-sleep-border shadow-md h-fit">
          <div className="flex justify-between items-center mb-6">
            <button onClick={handlePrevMonth} className="p-2 text-slate-muted hover:text-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h2 className="text-xl font-semibold text-slate-primary capitalize">
              {monthName} {year}
            </h2>
            <button onClick={handleNextMonth} className="p-2 text-slate-muted hover:text-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-medium text-slate-muted">
            <div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div><div>Sá</div><div>Do</div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square rounded-xl bg-transparent" />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const log = logsByDay.get(day);
              const isToday = new Date().getDate() === day && new Date().getMonth() + 1 === month && new Date().getFullYear() === year;
              const isSelected = selectedDay === day;
              
              return (
                <div 
                  key={day} 
                  onClick={() => log ? setSelectedDay(day) : setSelectedDay(null)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all
                    ${log ? `${getQualityColor(log.quality)} cursor-pointer` : 'bg-obsidian-surface text-slate-muted cursor-default'}
                    ${isToday ? 'ring-2 ring-white/50' : ''}
                    ${isSelected ? 'ring-2 ring-white scale-105' : ''}
                  `}
                  title={log ? `Calidad: ${log.quality}/5 - ${log.duration}h` : 'Sin registro'}
                >
                  <span className="font-medium text-sm">{day}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center gap-4 text-xs text-slate-muted">
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Bueno (4-5)</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Regular (3)</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Malo (1-2)</div>
          </div>
        </div>

        {/* Lista de Registros */}
        <div className="bg-obsidian-card p-6 rounded-2xl border border-sleep-border shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-primary">
              {selectedDay 
                ? `Registros del día ${selectedDay} de ${monthName}`
                : `Registros de ${monthName}`}
            </h3>
            {selectedDay !== null && (
              <button 
                onClick={() => setSelectedDay(null)}
                className="text-xs text-accent hover:underline"
              >
                Ver todos
              </button>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <SleepLogList logs={filteredLogs} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
