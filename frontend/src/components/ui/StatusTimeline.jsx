import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatDateTime } from '../../utils/format';
import { titleCase } from '../../utils/format';

export default function StatusTimeline({ steps, currentIndex, history = [] }) {
  return (
    <ol className="relative">
      {steps.map((step, i) => {
        const done = i <= currentIndex;
        const historyEntry = history.find((h) => h.status === step);
        return (
          <li key={step} className="relative pb-8 last:pb-0 pl-9">
            {i < steps.length - 1 && (
              <span className={cn('absolute left-[15px] top-7 w-0.5 h-[calc(100%-1.25rem)]', done ? 'bg-teal-500' : 'bg-teal-100 dark:bg-teal-900/60')} />
            )}
            <span
              className={cn(
                'absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center',
                done ? 'bg-teal-600 text-white' : 'bg-teal-50 dark:bg-teal-900/40 text-teal-400'
              )}
            >
              {done ? <Check className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full bg-current" />}
            </span>
            <div className="pt-1">
              <p className={cn('text-sm font-medium', done ? 'text-ink-light dark:text-ink-dark' : 'text-ink-light/40 dark:text-ink-dark/40')}>
                {titleCase(step)}
              </p>
              {historyEntry && <p className="text-xs text-ink-light/65 dark:text-ink-dark/65 mt-0.5">{formatDateTime(historyEntry.at)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
