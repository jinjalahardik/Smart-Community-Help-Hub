import { AlertTriangle, WifiOff, RefreshCw } from 'lucide-react';
import Button from './Button';

export function ErrorState({ title = 'Something went wrong', description = 'Please try again.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="w-14 h-14 rounded-2xl bg-coral-50 dark:bg-coral-900/30 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-coral-500" />
      </div>
      <p className="font-display font-semibold">{title}</p>
      <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1 max-w-sm">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" icon={RefreshCw} onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

export function OfflineBanner() {
  return (
    <div className="flex items-center gap-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm px-4 py-2.5 rounded-xl">
      <WifiOff className="w-4 h-4 shrink-0" />
      You appear to be offline. Some features may not work until you reconnect.
    </div>
  );
}
