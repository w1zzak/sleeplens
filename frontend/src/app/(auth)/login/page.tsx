'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/schemas/auth';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AuthResponse } from '@/types/auth';

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const { login } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setServerError(null);
      const response = await api<AuthResponse>('/auth/login', {
        method: 'POST',
        data,
      });
      login(response);
    } catch (error: unknown) {
      setServerError(error instanceof Error ? error.message : 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian p-4">
      <div className="w-full max-w-md bg-obsidian-card p-8 rounded-2xl border border-sleep-border shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-primary">Bienvenido de vuelta</h1>
          <p className="text-slate-muted mt-2 text-sm">Ingresa a tu cuenta para registrar tu sueño</p>
        </div>

        {serverError && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            Iniciar sesión
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-muted">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="text-accent hover:text-accent-light font-medium transition-colors">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
