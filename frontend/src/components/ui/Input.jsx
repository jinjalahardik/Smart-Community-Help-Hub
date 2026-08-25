import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(function Input(
  { label, error, hint, icon: Icon, className, containerClassName, required, ...props },
  ref
) {
  const id = useId();
  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label htmlFor={props.id || id} className="block text-sm font-medium mb-1.5 text-ink-light dark:text-ink-dark">
          {label} {required && <span className="text-coral-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-teal-500/70" aria-hidden="true" />}
        <input
          ref={ref}
          id={props.id || id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(
            'w-full rounded-xl border bg-white dark:bg-teal-950/40 px-3.5 py-2.5 text-sm transition-colors duration-150',
            'placeholder:text-ink-light/40 dark:placeholder:text-ink-dark/40',
            'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
            error ? 'border-coral-400' : 'border-teal-100 dark:border-teal-900/60',
            Icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-coral-600 dark:text-coral-400">{error}</p>}
      {!error && hint && <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-light/65 dark:text-ink-dark/65">{hint}</p>}
    </div>
  );
});

export default Input;
