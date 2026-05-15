'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center p-8">
          <div className="max-w-md w-full bg-[#16213e] border border-[#2d2d4e] rounded-2xl p-8 shadow-xl text-center">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-400"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </div>

            {/* Content */}
            <h2 className="text-xl font-bold text-slate-100 mb-2">Algo salió mal</h2>
            <p className="text-sm text-slate-400 mb-2">
              Ocurrió un error inesperado en esta sección. Puedes intentar recargar o volver al dashboard.
            </p>
            {this.state.errorMessage && (
              <p className="text-xs text-red-400/70 font-mono bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2 mb-6 text-left truncate">
                {this.state.errorMessage}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 py-3 rounded-xl font-semibold text-sm bg-violet-700 hover:bg-violet-600 text-white transition-colors"
              >
                Reintentar
              </button>
              <button
                onClick={() => (window.location.href = '/dashboard')}
                className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[#0f0f1a] hover:bg-[#1a1a30] border border-[#2d2d4e] text-slate-300 transition-colors"
              >
                Ir al Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
