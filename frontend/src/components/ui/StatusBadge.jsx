import { cn } from '../../utils/cn';

/**
 * StatusBadge - Uniform status indicator with accessible contrast and glowing dot
 */
export function StatusBadge({ status, label, className }) {
  const map = {
    // Normal positive / completed
    completed: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    verified: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    active: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20',
    
    // In progress / pending
    pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    in_transit: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20',
    assigned: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',

    // Urgent / emergency
    emergency: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 font-bold animate-pulse',
    urgent: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30 font-bold',
    cancelled: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
    rejected: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
  };

  const current = map[status?.toLowerCase()] || 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm tracking-wide',
        current,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" aria-hidden="true" />
      {label || status}
    </span>
  );
}

export default StatusBadge;
