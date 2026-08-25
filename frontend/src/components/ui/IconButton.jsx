import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const IconButton = forwardRef(function IconButton(
  { icon: Icon, label, variant = 'ghost', size = 'md', className, ...props },
  ref
) {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  const iconSizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  const variants = {
    ghost: 'hover:bg-teal-50 dark:hover:bg-teal-900/40 text-ink-light dark:text-ink-dark',
    primary: 'bg-teal-600 text-white hover:bg-teal-700',
    subtle: 'bg-teal-50 dark:bg-teal-900/40 text-teal-700 dark:text-teal-200 hover:bg-teal-100',
  };
  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition-colors duration-150',
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      <Icon className={iconSizes[size]} aria-hidden="true" />
    </button>
  );
});

export default IconButton;
