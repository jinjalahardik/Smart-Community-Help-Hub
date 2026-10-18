import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import CountUp from './CountUp';

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-[24px] bg-white/90 dark:bg-[#0D2622]/90 backdrop-blur-xl border border-teal-100/80 dark:border-teal-400/[0.16] shadow-[0_4px_24px_rgba(15,118,110,0.06)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.45)]',
        hover && 'transition-all duration-300 hover:shadow-[0_12px_36px_rgba(15,118,110,0.14)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)] hover:border-teal-300/80 dark:hover:border-teal-400/40 hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, trend, trendLabel, accent = 'teal', className }) {
  const accents = {
    teal: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-300/30 dark:border-teal-500/25 shadow-[0_0_15px_rgba(45,212,191,0.15)]',
    amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300/30 dark:border-amber-500/25',
    coral: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-300/30 dark:border-rose-500/25 shadow-[0_0_15px_rgba(244,63,94,0.18)]',
    cyan: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-300/30 dark:border-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      <Card className={cn('p-5 sm:p-6 transition-all duration-300 relative overflow-hidden group', className)}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-light/65 dark:text-ink-dark/65 font-body">
              {label}
            </p>
            <p className="text-2xl sm:text-3xl font-display font-extrabold text-ink-light dark:text-ink-dark mt-2 tracking-tight">
              <CountUp value={value} />
            </p>
            {trend !== undefined && (
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className={cn(
                    'text-xs font-bold px-1.5 py-0.5 rounded-md inline-block',
                    trend >= 0
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                      : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                  )}
                >
                  {trend >= 0 ? '+' : ''}{trend}%
                </span>
                {trendLabel && (
                  <span className="text-xs text-ink-light/50 dark:text-ink-dark/50 font-medium">
                    {trendLabel}
                  </span>
                )}
              </div>
            )}
          </div>
          {Icon && (
            <div
              className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110',
                accents[accent] || accents.teal
              )}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
