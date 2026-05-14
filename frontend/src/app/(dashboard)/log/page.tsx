'use client';

import React, { useEffect, useState } from 'react';
import { SleepLogForm } from '@/components/sleep/SleepLogForm';
import { SleepLogList } from '@/components/sleep/SleepLogList';
import { SleepLog, CreateSleepLogInput } from '@/types/sleep';
import { api } from '@/lib/api';

export default function LogPage() {
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const data = await api<SleepLog[]>('/sleep');
      setLogs(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los registros');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (data: CreateSleepLogInput) => {
    try {
      setError(null);
      await api('/sleep', {
        method: 'POST',
        data,
      });
      await fetchLogs(); // Recargar la lista
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar el registro');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro?')) return;
    try {
      await api(`/sleep/${id}`, { method: 'DELETE' });
      await fetchLogs();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error al eliminar el registro');
    }
  };

  return (
    <div className="min-h-screen bg-obsidian p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-primary">Registro Diario</h1>
          <p className="text-slate-muted mt-2">Registra tu sueño para obtener insights y análisis semanales.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <SleepLogForm onSubmit={handleSubmit} />
          </div>
          
          <div className="bg-obsidian-card p-6 rounded-2xl border border-sleep-border shadow-md h-fit">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <SleepLogList logs={logs} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
