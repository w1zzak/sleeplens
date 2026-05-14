'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/log', label: 'Registro Diario', icon: '✍️' },
    { href: '/history', label: 'Historial', icon: '📅' },
  ];

  return (
    <aside className="w-64 bg-obsidian-card border-r border-sleep-border flex flex-col min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-primary flex items-center gap-2">
          <span className="text-accent">●</span> SleepLens
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-accent/10 text-accent font-semibold'
                  : 'text-slate-muted hover:bg-obsidian-surface hover:text-slate-primary'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-sleep-border">
        <div className="px-4 py-3 mb-2 rounded-xl bg-obsidian-surface text-sm">
          <p className="text-slate-muted">Usuario</p>
          <p className="text-slate-primary font-medium truncate">{user?.name}</p>
        </div>
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};
