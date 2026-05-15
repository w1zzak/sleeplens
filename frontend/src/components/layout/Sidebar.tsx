'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const links = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/>
        <rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
      </svg>
    ),
  },
  {
    href: '/log',
    label: 'Registro',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 0 9.95 9h.05a10 10 0 1 1-10-9z"/>
      </svg>
    ),
  },
  {
    href: '/history',
    label: 'Historial',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/>
        <line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
      </svg>
    ),
  },
  {
    href: '/chat',
    label: 'AI Chat',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/>
        <path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
      </svg>
    ),
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <>
      {/* ── DESKTOP SIDEBAR (hidden on mobile) ── */}
      <aside className="hidden md:flex w-64 bg-obsidian-card border-r border-sleep-border flex-col min-h-screen flex-shrink-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-primary flex items-center gap-2">
            <span className="text-accent">●</span> SleepLens
          </h2>
        </div>

        <nav className="flex-1 px-4 space-y-1">
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
                <span className={isActive ? 'text-accent' : 'text-slate-muted'}>{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-sleep-border">
          <div className="px-4 py-3 mb-2 rounded-xl bg-obsidian-surface text-sm">
            <p className="text-slate-muted text-xs">Usuario</p>
            <p className="text-slate-primary font-medium truncate">{user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV (visible only on mobile) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-obsidian-card border-t border-sleep-border safe-area-bottom">
        <div className="flex items-stretch h-16">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] transition-colors ${
                  isActive ? 'text-accent' : 'text-slate-muted'
                }`}
              >
                <span className={isActive ? 'text-accent' : 'text-slate-muted'}>
                  {link.icon}
                </span>
                <span className={`text-[10px] font-medium ${isActive ? 'text-accent' : 'text-slate-muted'}`}>
                  {link.label}
                </span>
                {isActive && (
                  <span className="absolute top-0 h-0.5 w-8 bg-accent rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};
