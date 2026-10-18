import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Premium 2026 GlassPanel Component
 * Provides subtle refraction, border glows, and elevated depth without muddy blur
 */
export const GlassPanel = forwardRef(function GlassPanel(
  { children, className, variant = 'default', hover = false, glow = 'none', ...props },
  ref
) {
  const variants = {
    default: 'bg-white/80 dark:bg-[#071916]/80 backdrop-blur-xl border border-teal-200/50 dark:border-teal-500/15 shadow-[0_8px_32px_rgba(15,118,110,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]',
    elevated: 'bg-white/95 dark:bg-[#0A221E]/90 backdrop-blur-2xl border border-teal-200/70 dark:border-teal-400/20 shadow-[0_16px_48px_rgba(15,118,110,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.65)]',
    subtle: 'bg-white/50 dark:bg-white/[0.03] backdrop-blur-lg border border-teal-100/60 dark:border-white/[0.06]',
    emergency: 'bg-rose-50/90 dark:bg-rose-950/40 backdrop-blur-xl border border-rose-300/60 dark:border-rose-500/30 shadow-[0_8px_32px_rgba(244,63,94,0.12)]',
  };

  const glows = {
    none: '',
    teal: 'hover:shadow-[0_0_30px_rgba(45,212,191,0.3)]',
    coral: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.35)]',
    cyan: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]',
  };

  return (
    <motion.div
      ref={ref}
      whileHover={hover ? { y: -4, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } } : undefined}
      className={cn(
        'rounded-[24px] transition-all duration-300',
        variants[variant],
        glows[glow],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});

export default GlassPanel;
