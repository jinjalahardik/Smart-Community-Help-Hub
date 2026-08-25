import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import CountUp from './CountUp';

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white dark:bg-surface-card border border-teal-100/70 dark:border-teal-200/[0.14] shadow-card dark:shadow-dark-card',
        hover && 'transition-shadow duration-200 hover:shadow-card-hover dark:hover:border-teal-400/30',
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
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    coral: 'bg-coral-50 text-coral-700 dark:bg-coral-900/30 dark:text-coral-300',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <Card className={cn('p-5 transition-shadow duration-200 hover:shadow-card-hover', className)}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-ink-light/60 dark:text-ink-dark/60">{label}</p>
            <p className="text-2xl font-display font-bold mt-1.5">
              <CountUp value={value} />
            </p>
            {trend !== undefined && (
              <p className={cn('text-xs mt-1.5 font-medium', trend >= 0 ? 'text-teal-600' : 'text-coral-500')}>
                {trend >= 0 ? '+' : ''}{trend}% {trendLabel}
              </p>
            )}
          </div>
          {Icon && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', accents[accent])}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
