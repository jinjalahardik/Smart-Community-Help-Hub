import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const VARIANTS = {
  primary: 'bg-teal-600 text-white hover:bg-teal-700 shadow-soft focus-visible:ring-teal-500',
  secondary: 'bg-amber-600 text-white hover:bg-amber-700 shadow-soft',
  coral: 'bg-coral-600 text-white hover:bg-coral-700 shadow-soft',
  outline: 'border border-teal-600 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30',
  ghost: 'text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-900/30',
  danger: 'bg-coral-600 text-white hover:bg-coral-700',
  subtle: 'bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/40 dark:text-teal-200',
};

const SIZES = {
  sm: 'text-sm px-3 py-1.5 rounded-lg gap-1.5',
  md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
  lg: 'text-base px-6 py-3 rounded-xl gap-2',
};

const Button = forwardRef(function Button(
  { children, variant = 'primary', size = 'md', loading = false, disabled, className, icon: Icon, iconPosition = 'left', type = 'button', ...props },
  ref
) {
  const isDisabled = disabled || loading;
  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      whileHover={isDisabled ? undefined : { scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </motion.button>
  );
});

export default Button;
