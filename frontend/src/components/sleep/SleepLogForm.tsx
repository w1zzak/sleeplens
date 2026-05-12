'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sleepLogFormSchema, SleepLogFormValues } from '@/schemas/sleep';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { SleepLog, CreateSleepLogInput } from '@/types/sleep';

interface SleepLogFormProps {
  onSubmit: (data: CreateSleepLogInput) => Promise<void>;
  isSubmitting?: boolean;
}

export const SleepLogForm: React.FC<SleepLogFormProps> = ({ onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<SleepLogFormValues>({
    resolver: zodResolver(sleepLogFormSchema),
    defaultValues: {
      quality: 3,
      stress: 1,
      exercise: false,
      caffeine: false,
      alcohol: false,
      screenTime: false,
    },
  });

  const submitHandler = async (data: SleepLogFormValues): Promise<void> => {
    // Format dates to ISO strings for backend
    const formattedData: CreateSleepLogInput = {
      ...data,
      bedtime: new Date(data.bedtime).toISOString(),
      wakeTime: new Date(data.wakeTime).toISOString(),
    };
    await onSubmit(formattedData);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6 bg-obsidian-card p-6 rounded-2xl border border-sleep-border shadow-md">
      <h2 className="text-xl font-bold text-slate-primary mb-4">Nuevo Registro</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Hora de acostarse (Bedtime)"
          type="datetime-local"
          {...register('bedtime')}
          error={errors.bedtime?.message}
        />
        <Input
          label="Hora de despertarse (WakeTime)"
          type="datetime-local"
          {...register('wakeTime')}
          error={errors.wakeTime?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-muted">Calidad del Sueño (1-5)</label>
          <select 
            {...register('quality')} 
            className="w-full px-4 py-2.5 rounded-lg bg-obsidian-surface border border-sleep-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-slate-primary"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          {errors.quality && <span className="text-xs text-red-500">{errors.quality.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-muted">Nivel de Estrés (1-5)</label>
          <select 
            {...register('stress')} 
            className="w-full px-4 py-2.5 rounded-lg bg-obsidian-surface border border-sleep-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-slate-primary"
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          {errors.stress && <span className="text-xs text-red-500">{errors.stress.message}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-muted">Factores del día</label>
        <div className="flex flex-wrap gap-4 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('exercise')} className="w-5 h-5 accent-accent" />
            <span className="text-slate-primary text-sm">Ejercicio</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('caffeine')} className="w-5 h-5 accent-accent" />
            <span className="text-slate-primary text-sm">Cafeína</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('alcohol')} className="w-5 h-5 accent-accent" />
            <span className="text-slate-primary text-sm">Alcohol</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('screenTime')} className="w-5 h-5 accent-accent" />
            <span className="text-slate-primary text-sm">Pantallas tarde</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-muted">Notas adicionales</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg bg-obsidian-surface border border-sleep-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-slate-primary resize-none placeholder-slate-muted/50"
          placeholder="¿Cómo te sentiste hoy al despertar?"
        />
      </div>

      <Button type="submit" fullWidth disabled={isSubmitting}>
        Guardar Registro
      </Button>
    </form>
  );
};
