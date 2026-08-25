import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';

const Textarea = forwardRef(function Textarea(
  { label, error, hint, rows = 4, className, containerClassName, required, ...props },
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
      <textarea
        ref={ref}
        id={props.id || id}
        rows={rows}
        aria-invalid={!!error}
        className={cn(
          'w-full rounded-xl border bg-white dark:bg-teal-950/40 px-3.5 py-2.5 text-sm transition-colors duration-150 resize-y',
          'placeholder:text-ink-light/40 dark:placeholder:text-ink-dark/40',
          'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
          error ? 'border-coral-400' : 'border-teal-100 dark:border-teal-900/60',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-coral-600 dark:text-coral-400">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-ink-light/65 dark:text-ink-dark/65">{hint}</p>}
    </div>
  );
});

export default Textarea;
