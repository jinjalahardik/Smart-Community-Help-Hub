import { forwardRef, useId, useState, useMemo } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

function scorePassword(pw = '') {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

const LEVELS = [
  { label: 'Very weak', color: 'bg-coral-500' },
  { label: 'Weak', color: 'bg-coral-400' },
  { label: 'Fair', color: 'bg-amber-500' },
  { label: 'Good', color: 'bg-teal-400' },
  { label: 'Strong', color: 'bg-teal-600' },
];

/**
 * Password input with a show/hide toggle. Pass `showStrength` to render
 * a live strength meter beneath the field (intended for registration /
 * reset-password forms, not login).
 */
const PasswordInput = forwardRef(function PasswordInput(
  { label, error, hint, showStrength = false, value, className, containerClassName, required, onChange, ...props },
  ref
) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const score = useMemo(() => scorePassword(value || ''), [value]);
  const level = LEVELS[score];

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label htmlFor={props.id || id} className="block text-sm font-medium mb-1.5 text-ink-light dark:text-ink-dark">
          {label} {required && <span className="text-coral-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={props.id || id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(
            'w-full rounded-xl border bg-white dark:bg-teal-950/40 px-3.5 py-2.5 pr-10 text-sm transition-colors duration-150',
            'placeholder:text-ink-light/40 dark:placeholder:text-ink-dark/40',
            'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
            error ? 'border-coral-400' : 'border-teal-100 dark:border-teal-900/60',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light/40 hover:text-teal-600 dark:text-ink-dark/40 dark:hover:text-teal-400 transition-colors"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {showStrength && value && (
        <div className="mt-2">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn('h-1 flex-1 rounded-full transition-colors duration-200', i <= score - 1 ? level.color : 'bg-teal-100 dark:bg-teal-900/60')}
              />
            ))}
          </div>
          <p className={cn('text-xs mt-1', score <= 1 ? 'text-coral-600' : score <= 2 ? 'text-amber-600' : 'text-teal-600')}>
            {level.label} password
          </p>
        </div>
      )}

      {error && <p id={`${id}-error`} className="mt-1.5 text-xs text-coral-600 dark:text-coral-400">{error}</p>}
      {!error && hint && <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-light/65 dark:text-ink-dark/65">{hint}</p>}
    </div>
  );
});

export default PasswordInput;
