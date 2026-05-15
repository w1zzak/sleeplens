'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { SleepStats, SleepLog } from '@/types/sleep';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Markdown } from '@/components/ui/Markdown';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';

// --- Skeleton for the dashboard ---
const DashboardSkeleton = () => (
  <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-pulse">
    <div className="space-y-2">
      <Skeleton className="h-7 md:h-8 w-40 md:w-48" />
      <Skeleton className="h-4 w-56 md:w-72" />
    </div>
    {/* Metric cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-[#16213e] p-5 md:p-6 rounded-2xl border border-[#2d2d4e]">
          <Skeleton className="h-3 w-28 mb-3 md:mb-4" />
          <Skeleton className="h-8 md:h-9 w-20" />
        </div>
      ))}
    </div>
    {/* Weekly report */}
    <div className="bg-[#16213e] p-5 md:p-6 rounded-2xl border border-[#2d2d4e]">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48 md:w-52" />
          <Skeleton className="h-3 w-56 md:w-72" />
        </div>
        <Skeleton className="h-10 md:h-9 w-full sm:w-32 rounded-xl" />
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-[#16213e] p-5 md:p-6 rounded-2xl border border-[#2d2d4e]">
          <Skeleton className="h-5 w-48 md:w-56 mb-5 md:mb-6" />
          <Skeleton className="h-52 md:h-64 w-full rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);

// --- Empty state for charts when no logs ---
const ChartsEmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 rounded-2xl bg-violet-700/10 border border-violet-700/20 flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
        <path d="M12 2a10 10 0 0 0 9.95 9h.05a10 10 0 1 1-10-9z"/>
      </svg>
    </div>
    <h3 className="text-slate-100 font-semibold mb-1">Sin datos aún</h3>
    <p className="text-sm text-slate-400 mb-4 max-w-xs">
      Tus gráficas aparecerán aquí cuando registres tu primera noche de sueño.
    </p>
    <Link
      href="/log"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-700 hover:bg-violet-600 text-white text-sm font-medium transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Registrar primera noche
    </Link>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<SleepStats | null>(null);
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [weeklyReport, setWeeklyReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsData, logsData] = await Promise.all([
          api<SleepStats>('/sleep/stats'),
          api<SleepLog[]>('/sleep') // Fetching recent logs for charts
        ]);
        setStats(statsData);
        
        // Check if the most recent log has a weekly report
        if (logsData.length > 0 && logsData[0].weeklyReport) {
          setWeeklyReport(logsData[0].weeklyReport);
        }

        // Take last 30 logs and reverse them for chronological order in charts
        setLogs(logsData.slice(0, 30).reverse());
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setReportError(null);
    try {
      const response = await api<string>('/ai/weekly-report', { method: 'POST' });
      setWeeklyReport(response);
    } catch (error: unknown) {
      setReportError(error instanceof Error ? error.message : 'Error al generar el reporte semanal');
    } finally {
      setIsGenerating(false);
    }
  };

  const chartData = logs.map(log => ({
    date: new Date(log.bedtime).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    calidad: log.quality,
    horas: log.duration || 0,
  }));

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-primary">Dashboard</h1>
        <p className="text-slate-muted mt-1 md:mt-2 text-sm md:text-base">Tu resumen de sueño y métricas clave.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-obsidian-card p-6 rounded-2xl border border-sleep-border shadow-md">
          <p className="text-sm text-slate-muted mb-1">Promedio de Horas</p>
          <p className="text-3xl font-bold text-slate-primary">
            {stats?.avgDuration || 0} <span className="text-lg text-slate-muted font-normal">h</span>
          </p>
        </div>
        <div className="bg-obsidian-card p-6 rounded-2xl border border-sleep-border shadow-md">
          <p className="text-sm text-slate-muted mb-1">Calidad Promedio</p>
          <p className="text-3xl font-bold text-accent-light">
            {stats?.avgQuality || 0} <span className="text-lg text-slate-muted font-normal">/ 5</span>
          </p>
        </div>
        <div className="bg-obsidian-card p-6 rounded-2xl border border-emerald-500/20 shadow-md">
          <p className="text-sm text-emerald-500/80 mb-1">Racha Actual</p>
          <p className="text-3xl font-bold text-emerald-500">
            {stats?.currentStreak || 0} <span className="text-lg text-emerald-500/60 font-normal">días</span>
          </p>
        </div>
      </div>

      {/* Weekly AI Report Section */}
      <div className="bg-obsidian-card p-6 rounded-2xl border border-accent/30 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 relative z-10">
          <div>
            <h3 className="text-base md:text-lg font-bold text-slate-primary flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-light"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
              Reporte Semanal Inteligente
            </h3>
            <p className="text-xs md:text-sm text-slate-muted">Análisis avanzado de tus patrones de sueño impulsado por SleepLens AI.</p>
          </div>
          
          <button 
            onClick={handleGenerateReport}
            disabled={isGenerating || logs.length < 3}
            className="w-full sm:w-auto min-h-[44px] bg-accent hover:bg-accent-light text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generando...
              </>
            ) : (
              'Generar Reporte'
            )}
          </button>
        </div>

        {reportError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-4">
            {reportError}
          </div>
        )}

        {logs.length < 3 && !weeklyReport && (
          <div className="bg-obsidian-surface/50 border border-sleep-border border-dashed p-6 text-center rounded-xl">
            <p className="text-slate-muted text-sm">
              Necesitas registrar al menos 3 noches para que la IA tenga suficientes datos para encontrar patrones confiables.
            </p>
          </div>
        )}

        {isGenerating ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-accent-light text-sm animate-pulse">Analizando correlaciones entre tus hábitos y calidad de sueño...</p>
          </div>
        ) : weeklyReport ? (
          <div className="bg-obsidian-surface border border-sleep-border rounded-xl p-6">
            <Markdown text={weeklyReport} />
          </div>
        ) : null}
      </div>

      {logs.length === 0 ? (
        <div className="bg-obsidian-card rounded-2xl border border-sleep-border shadow-md">
          <ChartsEmptyState />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-obsidian-card p-6 rounded-2xl border border-sleep-border shadow-md">
            <h3 className="text-lg font-semibold text-slate-primary mb-6">Calidad de Sueño (Últimos registros)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 5]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#16213e', border: '1px solid #2d2d4e', borderRadius: '8px', color: '#f1f5f9' }}
                    itemStyle={{ color: '#a78bfa' }}
                  />
                  <Line type="monotone" dataKey="calidad" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-obsidian-card p-6 rounded-2xl border border-sleep-border shadow-md">
            <h3 className="text-lg font-semibold text-slate-primary mb-6">Horas Dormidas (Últimos registros)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#16213e', border: '1px solid #2d2d4e', borderRadius: '8px', color: '#f1f5f9' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Line type="monotone" dataKey="horas" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

