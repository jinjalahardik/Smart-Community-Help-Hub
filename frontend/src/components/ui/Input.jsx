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
        <label htmlFor={props.id || id} className="block text-sm font-medium mb-1.5 text-slate-900 dark:text-slate-100 font-display">
          {label} {required && <span className="text-coral-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors" aria-hidden="true" />}
        <input
          ref={ref}
          id={props.id || id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(
            'w-full h-12 px-4 rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm transition-all outline-none',
            'border-slate-200 dark:border-slate-700',
            'placeholder:text-slate-400 dark:placeholder:text-slate-500',
            'focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20',
            'autofill:bg-white autofill:text-slate-900 dark:autofill:bg-slate-900 dark:autofill:text-white',
            error ? 'border-coral-500 focus:border-coral-500 focus:ring-coral-500/20' : '',
            Icon && 'pl-11',
            className
          )}
          {...props}
        />
      </div>
      {error && <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-coral-600 dark:text-coral-400">{error}</p>}
      {!error && hint && <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
});

export default Input;
