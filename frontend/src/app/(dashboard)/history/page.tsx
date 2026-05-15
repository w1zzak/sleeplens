'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { SleepLog } from '@/types/sleep';
import { SleepLogList } from '@/components/sleep/SleepLogList';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';

// --- Calendar Skeleton ---
const CalendarSkeleton = () => (
  <div className="bg-obsidian-card p-4 md:p-6 rounded-2xl border border-sleep-border shadow-md h-fit">
    <div className="flex justify-between items-center mb-5 md:mb-6">
      <Skeleton className="w-9 h-9 rounded-lg" />
      <Skeleton className="h-6 w-32 md:w-36" />
      <Skeleton className="w-9 h-9 rounded-lg" />
    </div>
    <div className="grid grid-cols-7 gap-1.5 md:gap-2 mb-2">
      {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-4" />)}
    </div>
    <div className="grid grid-cols-7 gap-1.5 md:gap-2">
      {[...Array(35)].map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
    </div>
    <div className="mt-5 md:mt-6 flex justify-center gap-3 md:gap-4">
      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-3 w-16 md:w-20" />)}
    </div>
  </div>
);

const ListSkeleton = () => (
  <div className="bg-obsidian-card p-6 rounded-2xl border border-sleep-border shadow-md">
    <Skeleton className="h-6 w-48 mb-6" />
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-[#0f0f1a] p-4 rounded-xl border border-[#2d2d4e] space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-3 w-48" />
        </div>
      ))}
    </div>
  </div>
);

// --- Empty state for months with no logs ---
const MonthEmptyState = ({ monthName }: { monthName: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center px-6">
    <div className="w-14 h-14 rounded-2xl bg-[#0f0f1a] border border-[#2d2d4e] flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
      </svg>
    </div>
    <h3 className="text-slate-100 font-semibold mb-1">Sin registros en {monthName}</h3>
    <p className="text-sm text-slate-400 mb-4">
      No encontramos ninguna noche registrada para este mes.
    </p>
    <Link
      href="/log"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-700 hover:bg-violet-600 text-white text-sm font-medium transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Crear registro
    </Link>
  </div>
);

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
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = currentDate.toLocaleString('es-ES', { month: 'long' });

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

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-7 md:h-8 w-28 md:w-32" />
          <Skeleton className="h-4 w-52 md:w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <CalendarSkeleton />
          <ListSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-primary">Historial</h1>
        <p className="text-slate-muted mt-1 md:mt-2 text-sm md:text-base">Explora tus patrones de sueño a lo largo del tiempo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Calendario */}
        <div className="bg-obsidian-card p-4 md:p-6 rounded-2xl border border-sleep-border shadow-md h-fit">
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

          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 text-center text-xs md:text-sm font-medium text-slate-muted">
            <div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div><div>Sá</div><div>Do</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 md:gap-2">
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
                  className={`aspect-square rounded-lg md:rounded-xl flex flex-col items-center justify-center transition-all
                    ${log ? `${getQualityColor(log.quality)} cursor-pointer` : 'bg-obsidian-surface text-slate-muted cursor-default'}
                    ${isToday ? 'ring-2 ring-white/50' : ''}
                    ${isSelected ? 'ring-2 ring-white scale-105' : ''}
                  `}
                  title={log ? `Calidad: ${log.quality}/5 - ${log.duration}h` : 'Sin registro'}
                >
                  <span className="font-medium text-[11px] md:text-sm">{day}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 md:mt-6 flex flex-wrap justify-center gap-3 md:gap-4 text-xs text-slate-muted">
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Bueno (4-5)</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Regular (3)</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500"></span> Malo (1-2)</div>
          </div>
        </div>

        {/* Lista de Registros */}
        <div className="bg-obsidian-card p-4 md:p-6 rounded-2xl border border-sleep-border shadow-md">
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
          
          {filteredLogs.length === 0 ? (
            <MonthEmptyState monthName={monthName} />
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

