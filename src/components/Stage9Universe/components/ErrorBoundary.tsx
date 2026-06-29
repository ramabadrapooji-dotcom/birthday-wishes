import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white z-50">
          <div className="text-xl mb-4 font-mono">Recovering Universe...</div>
          <button 
            className="px-4 py-2 border border-white/20 rounded hover:bg-white/10"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Reboot Engine
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
