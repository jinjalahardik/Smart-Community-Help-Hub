import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function RoleSelector({ options, value, onSelect, className }) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3', className)}>
      {options.map((opt, i) => {
        const selected = value === opt.role;
        return (
          <motion.button
            key={opt.role}
            type="button"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3, scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(opt.role)}
            aria-pressed={selected}
            className={cn(
              'group relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-200 overflow-hidden',
              'backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-teal-500',
              selected
                ? 'border-teal-500 bg-teal-500/10 shadow-[0_0_24px_rgba(45,212,191,0.25)] dark:bg-teal-500/15'
                : 'border-teal-200/60 bg-white/70 hover:border-teal-400/80 hover:bg-white/90 dark:border-teal-900/60 dark:bg-surface-elevated/60 dark:hover:bg-surface-soft/80'
            )}
          >
            {/* Selection Check Indicator */}
            {selected && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-white shadow-sm"
              >
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </motion.span>
            )}

            <motion.span
              whileHover={{ rotate: 8, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 350, damping: 15 }}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200',
                selected
                  ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-[0_0_16px_rgba(45,212,191,0.45)]'
                  : 'bg-teal-500/10 text-teal-600 dark:text-teal-300 group-hover:bg-teal-500/20'
              )}
            >
              <opt.icon className="h-5 w-5" aria-hidden="true" />
            </motion.span>

            <div>
              <span className="font-display text-sm font-bold text-ink-light dark:text-ink-dark block">
                {opt.label}
              </span>
              <span className="text-xs leading-relaxed text-ink-light/65 dark:text-ink-dark/65 block mt-0.5">
                {opt.desc}
              </span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
