/**
 * ErrorBoundary — React error boundary
 * Layer: Shared / UI
 * Pattern: Error boundary (class component)
 *
 * Catches JavaScript errors in child tree and renders fallback or default
 * "Something went wrong" UI with Try again button. Optional custom fallback
 * prop. Resets state on retry. Use at route or app level for resilience.
 */

import { Component } from 'react';

import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
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

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground max-w-md text-center text-sm">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <Button variant="outline" onClick={this.handleReset}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
