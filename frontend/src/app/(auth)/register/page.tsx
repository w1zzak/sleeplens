'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '@/schemas/auth';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuthResponse } from '@/types/auth';

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const { login } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setServerError(null);
      const response = await api<AuthResponse>('/auth/register', {
        method: 'POST',
        data,
      });
      // Login automatically upon successful registration
      login(response);
    } catch (error: unknown) {
      setServerError(error instanceof Error ? error.message : 'Error al registrar la cuenta');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian p-4">
      <div className="w-full max-w-md bg-obsidian-card p-8 rounded-2xl border border-sleep-border shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-primary">Crear cuenta</h1>
          <p className="text-slate-muted mt-2 text-sm">Comienza a trackear tu sueño y descubre patrones</p>
        </div>

        {serverError && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Nombre completo"
            placeholder="Tu nombre"
            {...register('name')}
            error={errors.name?.message}
          />

          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            {...register('email')}
            error={errors.email?.message}
          />
          
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />

          <Button type="submit" fullWidth disabled={isSubmitting} className="mt-2">
            Registrarse
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-muted">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="text-accent hover:text-accent-light font-medium transition-colors">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
