import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 text-white shadow-[0_4px_16px_rgba(15,118,110,0.3)] hover:shadow-[0_8px_24px_rgba(45,212,191,0.45)] hover:from-teal-600 hover:to-cyan-500 border border-teal-400/20',
  secondary:
    'bg-amber-600 text-white hover:bg-amber-700 shadow-soft focus-visible:ring-amber-500',
  coral:
    'bg-gradient-to-r from-coral-600 via-rose-600 to-rose-700 text-white shadow-[0_4px_18px_rgba(244,63,94,0.35)] hover:shadow-[0_8px_28px_rgba(244,63,94,0.5)] border border-rose-400/30 focus-visible:ring-coral-500',
  outline:
    'border border-teal-300 dark:border-teal-500/40 text-teal-800 dark:text-teal-200 bg-white/50 dark:bg-teal-950/20 hover:bg-teal-50 dark:hover:bg-teal-900/40 hover:border-teal-400 backdrop-blur-md',
  ghost:
    'text-teal-800 dark:text-teal-200 hover:bg-teal-500/10 dark:hover:bg-teal-400/10',
  danger:
    'bg-coral-600 text-white hover:bg-coral-700 shadow-soft',
  subtle:
    'bg-teal-50 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900/60 border border-teal-100 dark:border-teal-800/50',
  white:
    'bg-white text-slate-900 hover:bg-slate-100 shadow-md border border-white/60 font-bold',
};

const SIZES = {
  sm: 'text-xs px-3.5 py-1.5 rounded-xl gap-1.5 font-semibold',
  md: 'text-sm px-4.5 py-2.5 rounded-2xl gap-2 font-semibold',
  lg: 'text-base px-6 py-3 rounded-2xl gap-2.5 font-bold',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    className,
    icon: Icon,
    iconPosition = 'left',
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading;
  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      whileHover={isDisabled ? undefined : { scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={cn(
        'relative inline-flex items-center justify-center font-display tracking-tight transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </motion.button>
  );
});

export default Button;
