import { forwardRef, useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Floating-label input used on the login page.
 * Supports email / password (with show-hide toggle). Presentation only.
 */
const LoginField = forwardRef(function LoginField(
  { id: propId, icon: Icon, label, type = 'text', error, hint, className, containerClassName, onBlur, ...props },
  ref
) {
  const autoId = useId();
  const id = propId || autoId;
  const isPassword = type === 'password';
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn('w-full', containerClassName)}>
      <div
        className={cn(
          'group relative rounded-2xl border bg-white transition-all duration-200 dark:bg-teal-950/40',
          'focus-within:border-teal-400 focus-within:shadow-[0_0_0_3px_rgba(45,212,191,0.16),0_0_24px_rgba(45,212,191,0.12)]',
          error
            ? 'border-coral-400 dark:border-coral-500'
            : 'border-teal-100 hover:border-teal-200 dark:border-teal-900/60 dark:hover:border-teal-800/80',
          className
        )}
      >
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-teal-500/70 transition-colors duration-200 group-focus-within:text-teal-500 dark:group-focus-within:text-teal-400"
            aria-hidden="true"
          />
        )}
        <input
          ref={ref}
          id={id}
          type={isPassword && visible ? 'text' : type}
          placeholder=" "
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          onBlur={(e) => {
            onBlur?.(e);
          }}
          className={cn(
            'peer w-full rounded-2xl bg-transparent pb-1.5 pl-11 pr-12 pt-5 text-sm text-ink-light outline-none placeholder:text-transparent dark:text-ink-dark',
            isPassword ? 'pr-12' : 'pr-4'
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 text-sm text-ink-light/45 transition-all duration-200 ease-out peer-focus:top-4 peer-focus:text-xs peer-focus:text-teal-600 dark:text-ink-dark/45 dark:peer-focus:text-teal-300 peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-teal-600 dark:peer-[:not(:placeholder-shown)]:text-teal-300"
        >
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-light/40 transition-colors duration-150 hover:text-teal-600 dark:text-ink-dark/40 dark:hover:text-teal-400"
          >
            {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-coral-600 dark:text-coral-400">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-light/65 dark:text-ink-dark/65">
          {hint}
        </p>
      )}
    </div>
  );
});

export default LoginField;
