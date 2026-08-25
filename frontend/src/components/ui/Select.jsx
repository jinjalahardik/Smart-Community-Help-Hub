import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder = 'Select an option', className, containerClassName, required, ...props },
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
        <select
          ref={ref}
          id={props.id || id}
          aria-invalid={!!error}
          className={cn(
            'w-full appearance-none rounded-xl border bg-white dark:bg-teal-950/40 px-3.5 py-2.5 pr-9 text-sm transition-colors duration-150',
            'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
            error ? 'border-coral-400' : 'border-teal-100 dark:border-teal-900/60',
            className
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-teal-500/70 pointer-events-none" />
      </div>
      {error && <p className="mt-1.5 text-xs text-coral-600 dark:text-coral-400">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-ink-light/65 dark:text-ink-dark/65">{hint}</p>}
    </div>
  );
});

export default Select;
