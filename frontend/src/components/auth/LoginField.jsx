import { forwardRef, useId, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Premium Floating-label input used on auth pages.
 * Robust state + CSS floating label to guarantee zero overlap between label and value.
 */
const LoginField = forwardRef(function LoginField(
  {
    id: propId,
    icon: Icon,
    label,
    type = 'text',
    error,
    hint,
    className,
    containerClassName,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    ...props
  },
  ref
) {
  const autoId = useId();
  const id = propId || autoId;
  const isPassword = type === 'password';
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value || defaultValue));

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setHasValue(Boolean(value));
    }
  }, [value]);

  const handleFocus = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    setHasValue(Boolean(e.target.value));
    onBlur?.(e);
  };

  const handleChange = (e) => {
    setHasValue(Boolean(e.target.value));
    onChange?.(e);
  };

  const isFloated = focused || hasValue;

  return (
    <div className={cn('w-full', containerClassName)}>
      <motion.div
        animate={error ? { x: [-6, 6, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className={cn(
          'group relative rounded-2xl border bg-white dark:bg-slate-900 transition-all duration-200 shadow-sm h-14',
          'focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/20 focus-within:shadow-[0_0_20px_rgba(20,184,166,0.2)]',
          error
            ? 'border-coral-500 focus-within:border-coral-500 focus-within:ring-coral-500/20 dark:border-coral-400 shadow-[0_0_16px_rgba(244,63,94,0.2)]'
            : 'border-slate-200 dark:border-slate-700 hover:border-teal-400 dark:hover:border-teal-500',
          className
        )}
      >
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors duration-200 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400"
            aria-hidden="true"
          />
        )}
        <input
          ref={ref}
          id={id}
          type={isPassword && visible ? 'text' : type}
          placeholder=""
          value={value}
          defaultValue={defaultValue}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className={cn(
            'auth-input peer w-full h-full rounded-2xl bg-transparent pt-5 pb-1.5 pl-11 text-sm font-body font-medium text-slate-900 dark:text-white outline-none transition-all',
            isPassword ? 'pr-12' : 'pr-4'
          )}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            'auth-label pointer-events-none absolute left-11 transition-all duration-200 ease-out select-none',
            isFloated
              ? 'top-2 text-[11px] font-bold text-teal-600 dark:text-teal-400'
              : 'top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 dark:text-slate-500'
          )}
        >
          {label}
        </label>
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 dark:text-slate-500 dark:hover:text-teal-400 transition-colors p-1"
          >
            {visible ? <EyeOff className="h-4.5 w-4.5" aria-hidden="true" /> : <Eye className="h-4.5 w-4.5" aria-hidden="true" />}
          </button>
        )}
      </motion.div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-coral-600 dark:text-coral-400">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}
    </div>
  );
});

export default LoginField;
