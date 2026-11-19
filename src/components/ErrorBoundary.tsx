import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  onReset?: () => void;
  onReturnHome?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CBT Test Engine ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  handleReturnHome = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReturnHome) {
      this.props.onReturnHome();
    } else {
      window.location.hash = '#/';
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#121318] border border-red-200 dark:border-red-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-3xl flex items-center justify-center mx-auto shadow-inner">
              ⚠️
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-50">
                CBT Test Engine Encountered an Issue
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                An unexpected render error occurred. Your candidate test state is preserved in local storage.
              </p>
            </div>
            {this.state.error && (
              <div className="text-left bg-slate-100 dark:bg-zinc-900/80 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-[11px] font-mono text-red-600 dark:text-red-400 overflow-x-auto max-h-36">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95"
              >
                ↺ Retry / Reload Test
              </button>
              <button
                type="button"
                onClick={this.handleReturnHome}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-xs transition-colors"
              >
                ← Return to Test Library
              </button>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500">
              NelovMallickIITD CBT Platform · 100% Free · Mentored by Nelov Mallick (IIT Delhi)
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
