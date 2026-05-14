'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { SleepStats, SleepLog } from '@/types/sleep';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [stats, setStats] = useState<SleepStats | null>(null);
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsData, logsData] = await Promise.all([
          api<SleepStats>('/sleep/stats'),
          api<SleepLog[]>('/sleep') // Fetching recent logs for charts
        ]);
        setStats(statsData);
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

  const chartData = logs.map(log => ({
    date: new Date(log.bedtime).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    calidad: log.quality,
    horas: log.duration || 0,
  }));

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center p-8 min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-primary">Dashboard</h1>
        <p className="text-slate-muted mt-2">Tu resumen de sueño y métricas clave.</p>
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
    </div>
  );
}
