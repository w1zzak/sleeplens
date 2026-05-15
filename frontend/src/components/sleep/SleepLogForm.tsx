'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateSleepLogInput } from '@/types/sleep';

// Internal form schema: date + time fields separated for better UX
const internalSchema = z.object({
  bedDate: z.string().min(1, 'La fecha es requerida'),
  bedTime: z.string().min(1, 'La hora es requerida'),
  wakeDate: z.string().min(1, 'La fecha es requerida'),
  wakeTime: z.string().min(1, 'La hora es requerida'),
  quality: z.number().int().min(1).max(5),
  stress: z.number().int().min(1).max(5),
  notes: z.string().optional(),
  exercise: z.boolean(),
  caffeine: z.boolean(),
  alcohol: z.boolean(),
  screenTime: z.boolean(),
});

type InternalFormValues = z.infer<typeof internalSchema>;

interface SleepLogFormProps {
  onSubmit: (data: CreateSleepLogInput) => Promise<void>;
  isSubmitting?: boolean;
}

// Factor toggle button config
const FACTORS = [
  { key: 'exercise' as const, label: 'Ejercicio', emoji: '🏃' },
  { key: 'caffeine' as const, label: 'Cafeína', emoji: '☕' },
  { key: 'alcohol' as const, label: 'Alcohol', emoji: '🍷' },
  { key: 'screenTime' as const, label: 'Pantallas', emoji: '📱' },
];

// Quality labels
const QUALITY_LABELS: Record<number, string> = {
  1: 'Muy malo',
  2: 'Malo',
  3: 'Regular',
  4: 'Bueno',
  5: 'Excelente',
};

const STRESS_LABELS: Record<number, string> = {
  1: 'Sin estrés',
  2: 'Leve',
  3: 'Moderado',
  4: 'Alto',
  5: 'Extremo',
};

// Shared input styling
const inputClass =
  'w-full px-4 py-3 rounded-xl bg-[#0f0f1a] border border-[#2d2d4e] text-slate-100 placeholder-slate-500 ' +
  'focus:outline-none focus:ring-2 focus:ring-violet-700/60 focus:border-violet-700/60 ' +
  'transition-all duration-200 text-sm ' +
  '[color-scheme:dark]';

const labelClass = 'block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2';

export const SleepLogForm: React.FC<SleepLogFormProps> = ({ onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting: formSubmitting },
    reset,
  } = useForm<InternalFormValues>({
    resolver: zodResolver(internalSchema),
    defaultValues: {
      bedDate: '',
      bedTime: '',
      wakeDate: '',
      wakeTime: '',
      quality: 3,
      stress: 1,
      exercise: false,
      caffeine: false,
      alcohol: false,
      screenTime: false,
      notes: '',
    },
  });

  const quality = watch('quality');
  const stress = watch('stress');

  const submitHandler = async (data: InternalFormValues): Promise<void> => {
    // Combine date + time into ISO strings for the backend
    const bedtimeISO = new Date(`${data.bedDate}T${data.bedTime}:00`).toISOString();
    const wakeTimeISO = new Date(`${data.wakeDate}T${data.wakeTime}:00`).toISOString();

    const formattedData: CreateSleepLogInput = {
      bedtime: bedtimeISO,
      wakeTime: wakeTimeISO,
      quality: data.quality,
      stress: data.stress,
      notes: data.notes,
      exercise: data.exercise,
      caffeine: data.caffeine,
      alcohol: data.alcohol,
      screenTime: data.screenTime,
    };

    await onSubmit(formattedData);
    reset();
  };

  const submitting = isSubmitting || formSubmitting;

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-7 bg-[#16213e] p-7 rounded-2xl border border-[#2d2d4e] shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-[#2d2d4e]">
        <div className="w-8 h-8 rounded-lg bg-violet-700/20 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-400">
            <path d="M12 2a10 10 0 0 0 9.95 9h.05a10 10 0 1 1-10-9z"/>
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-100 leading-tight">Nuevo Registro</h2>
          <p className="text-xs text-slate-400">Registra tu sueño de esta noche</p>
        </div>
      </div>

      {/* --- SECCIÓN: Hora de acostarse --- */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">🌙 Me acosté</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Fecha</label>
            <input
              type="date"
              {...register('bedDate')}
              className={inputClass}
            />
            {errors.bedDate && <p className="mt-1.5 text-xs text-red-400">{errors.bedDate.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Hora</label>
            <input
              type="time"
              {...register('bedTime')}
              className={inputClass}
            />
            {errors.bedTime && <p className="mt-1.5 text-xs text-red-400">{errors.bedTime.message}</p>}
          </div>
        </div>
      </div>

      {/* --- SECCIÓN: Hora de despertar --- */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">☀️ Me desperté</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Fecha</label>
            <input
              type="date"
              {...register('wakeDate')}
              className={inputClass}
            />
            {errors.wakeDate && <p className="mt-1.5 text-xs text-red-400">{errors.wakeDate.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Hora</label>
            <input
              type="time"
              {...register('wakeTime')}
              className={inputClass}
            />
            {errors.wakeTime && <p className="mt-1.5 text-xs text-red-400">{errors.wakeTime.message}</p>}
          </div>
        </div>
      </div>

      {/* --- SECCIÓN: Calidad del sueño --- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={labelClass}>Calidad del sueño</label>
          <span className="text-xs font-medium text-violet-400 bg-violet-700/15 px-2.5 py-1 rounded-full border border-violet-700/30">
            {QUALITY_LABELS[quality]}
          </span>
        </div>
        <Controller
          name="quality"
          control={control}
          render={({ field }) => (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((val) => {
                const isActive = field.value === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => field.onChange(val)}
                    className={`
                      flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 border
                      ${isActive
                        ? 'bg-violet-700 border-violet-600 text-white shadow-lg shadow-violet-900/40 scale-105'
                        : 'bg-[#0f0f1a] border-[#2d2d4e] text-slate-400 hover:border-violet-700/50 hover:text-violet-300'
                      }
                    `}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.quality && <p className="mt-1.5 text-xs text-red-400">{errors.quality.message}</p>}
      </div>

      {/* --- SECCIÓN: Nivel de estrés --- */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={labelClass}>Nivel de estrés</label>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
            stress <= 2
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              : stress === 3
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
              : 'text-red-400 bg-red-500/10 border-red-500/30'
          }`}>
            {STRESS_LABELS[stress]}
          </span>
        </div>
        <Controller
          name="stress"
          control={control}
          render={({ field }) => (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((val) => {
                const isActive = field.value === val;
                const colorActive =
                  val <= 2 ? 'bg-emerald-600 border-emerald-500 shadow-emerald-900/40'
                  : val === 3 ? 'bg-amber-600 border-amber-500 shadow-amber-900/40'
                  : 'bg-red-600 border-red-500 shadow-red-900/40';
                const colorHover =
                  val <= 2 ? 'hover:border-emerald-500/50 hover:text-emerald-300'
                  : val === 3 ? 'hover:border-amber-500/50 hover:text-amber-300'
                  : 'hover:border-red-500/50 hover:text-red-300';
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => field.onChange(val)}
                    className={`
                      flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 border
                      ${isActive
                        ? `${colorActive} text-white shadow-lg scale-105`
                        : `bg-[#0f0f1a] border-[#2d2d4e] text-slate-400 ${colorHover}`
                      }
                    `}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      {/* --- SECCIÓN: Factores del día --- */}
      <div>
        <label className={labelClass}>Factores del día</label>
        <div className="grid grid-cols-2 gap-2.5">
          {FACTORS.map(({ key, label, emoji }) => (
            <Controller
              key={key}
              name={key}
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={`
                    flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium
                    transition-all duration-200 text-left
                    ${field.value
                      ? 'bg-violet-700/20 border-violet-600/60 text-violet-300 shadow-inner shadow-violet-900/20'
                      : 'bg-[#0f0f1a] border-[#2d2d4e] text-slate-400 hover:border-violet-700/40 hover:text-slate-300'
                    }
                  `}
                >
                  <span className="text-base leading-none">{emoji}</span>
                  <span className="truncate">{label}</span>
                  <span className={`ml-auto w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                    field.value
                      ? 'bg-violet-600 border-violet-500'
                      : 'border-[#2d2d4e]'
                  }`}>
                    {field.value && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                </button>
              )}
            />
          ))}
        </div>
      </div>

      {/* --- SECCIÓN: Notas --- */}
      <div>
        <label className={labelClass}>Notas adicionales</label>
        <textarea
          {...register('notes')}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="¿Cómo te sentiste al despertar? ¿Algo inusual esta noche?"
        />
      </div>

      {/* --- SUBMIT --- */}
      <button
        type="submit"
        disabled={submitting}
        className="
          w-full py-3.5 rounded-xl font-semibold text-sm text-white
          bg-violet-700 hover:bg-violet-600
          border border-violet-600/50
          shadow-lg shadow-violet-900/30
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all duration-200 active:scale-[0.98]
          flex items-center justify-center gap-2
        "
      >
        {submitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            Guardar Registro
          </>
        )}
      </button>
    </form>
  );
};
