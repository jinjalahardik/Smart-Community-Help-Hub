import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export default function RoleSelector({ options, value, onSelect, className }) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-2.5', className)}>
      {options.map((opt, i) => {
        const selected = value === opt.role;
        return (
          <motion.button
            key={opt.role}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(opt.role)}
            aria-pressed={selected}
            className={cn(
              'group flex flex-col items-start gap-1.5 rounded-2xl border p-3.5 text-left transition-all duration-200',
              'backdrop-blur-md focus-visible:ring-2 focus-visible:ring-teal-500',
              selected
                ? 'border-teal-500/70 bg-teal-500/[0.08] shadow-[0_0_22px_rgba(45,212,191,0.22)]'
                : 'border-teal-200/60 bg-white/60 hover:border-teal-400/70 hover:bg-white/80 dark:border-teal-900/60 dark:bg-surface-elevated/60 dark:hover:bg-surface-soft/60'
            )}
          >
            <span
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-200',
                selected
                  ? 'bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-[0_0_14px_rgba(45,212,191,0.4)]'
                  : 'bg-teal-500/10 text-teal-700 dark:text-teal-300'
              )}
            >
              <opt.icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <span className="font-display text-sm font-semibold text-ink-light dark:text-ink-dark">{opt.label}</span>
            <span className="text-xs leading-snug text-ink-light/60 dark:text-ink-dark/60">{opt.desc}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
