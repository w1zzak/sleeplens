import React, { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-obsidian">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </ProtectedRoute>
  );
}


