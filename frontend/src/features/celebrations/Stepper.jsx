import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function Stepper({ steps, current, onStepClick }) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3">
      {steps.map((step, i) => {
        const index = i + 1;
        const done = index < current;
        const active = index === current;
        return (
          <li key={step} className="flex items-center gap-2 sm:gap-3 flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => active && onStepClick?.(index)}
              className={cn(
                'flex items-center gap-2 rounded-full px-0 sm:px-3 py-1 text-sm font-medium transition-colors',
                active ? 'text-teal-700 dark:text-teal-300' : done ? 'text-teal-600 dark:text-teal-400' : 'text-ink-light/45 dark:text-ink-dark/45',
                active && onStepClick ? 'cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-900/30' : 'cursor-default'
              )}
            >
              <span
                className={cn(
                  'w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  active
                    ? 'bg-teal-600 text-white shadow-[0_0_0_4px_rgba(45,212,191,0.2)]'
                    : done
                      ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300'
                      : 'bg-ink-light/10 text-ink-light/50 dark:bg-ink-dark/10 dark:text-ink-dark/50'
                )}
              >
                {done ? <Check className="w-4 h-4" /> : index}
              </span>
              <span className={cn('hidden sm:inline whitespace-nowrap', active ? 'text-sm' : 'text-xs')}>{step}</span>
            </button>
            {i < steps.length - 1 && (
              <motion.span
                aria-hidden="true"
                className="h-px flex-1 min-w-4 bg-teal-100 dark:bg-teal-900/60"
                animate={{ backgroundColor: done ? '#5eead4' : undefined }}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}