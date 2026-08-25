import { Component } from 'react';
import { AlertOctagon } from 'lucide-react';
import Button from '../ui/Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In production this would report to an error tracking service.
    console.error('ErrorBoundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-coral-50 dark:bg-coral-900/30 flex items-center justify-center mx-auto mb-5">
              <AlertOctagon className="w-8 h-8 text-coral-500" />
            </div>
            <h1 className="font-display font-bold text-xl">Something went wrong</h1>
            <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-2">
              An unexpected error occurred. Please refresh the page to continue using Smart Community Help Hub.
            </p>
            <Button className="mt-5" onClick={() => window.location.reload()}>Refresh Page</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
