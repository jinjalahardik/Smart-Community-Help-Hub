import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';

export const Checkbox = forwardRef(function Checkbox({ label, error, className, ...props }, ref) {
  const id = useId();
  return (
    <div>
      <label htmlFor={props.id || id} className="flex items-start gap-2.5 cursor-pointer select-none text-sm">
        <input
          ref={ref}
          id={props.id || id}
          type="checkbox"
          className={cn('mt-0.5 w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-500/30', className)}
          {...props}
        />
        <span className="text-ink-light dark:text-ink-dark">{label}</span>
      </label>
      {error && <p className="mt-1 text-xs text-coral-600 dark:text-coral-400">{error}</p>}
    </div>
  );
});

export function RadioGroup({ label, name, options, value, onChange, error, columns = 1 }) {
  return (
    <div>
      {label && <p className="block text-sm font-medium mb-2 text-ink-light dark:text-ink-dark">{label}</p>}
      <div className={cn('grid gap-2', columns === 2 ? 'grid-cols-2' : 'grid-cols-1')}>
        {options.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              'flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm cursor-pointer transition-colors',
              value === opt.value
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/40'
                : 'border-teal-100 dark:border-teal-900/60 hover:bg-teal-50/50 dark:hover:bg-teal-900/20'
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="w-4 h-4 text-teal-600 focus:ring-teal-500/30"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="mt-1.5 text-xs text-coral-600 dark:text-coral-400">{error}</p>}
    </div>
  );
}

export function Switch({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
          checked ? 'bg-teal-600' : 'bg-teal-100 dark:bg-teal-900/60'
        )}
      >
        <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200', checked ? 'translate-x-6' : 'translate-x-1')} />
      </button>
      {label && <span className="text-sm text-ink-light dark:text-ink-dark">{label}</span>}
    </label>
  );
}
