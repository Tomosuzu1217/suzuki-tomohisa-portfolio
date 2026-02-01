import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex items-center justify-center min-h-[200px] bg-[#1a1a1a] border border-white/10 p-8">
          <div className="text-center">
            <p className="text-white/60 text-sm mb-2">コンポーネントの読み込みに失敗しました</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="text-xs text-[#C5A265] border border-[#C5A265]/40 px-4 py-2 hover:bg-[#C5A265] hover:text-black transition-colors"
            >
              再試行
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
