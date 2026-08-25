import { cn } from '../../utils/cn';
import { titleCase } from '../../utils/format';

export function Badge({ children, tone = 'teal', className }) {
  const tones = {
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    coral: 'bg-coral-50 text-coral-700 dark:bg-coral-900/30 dark:text-coral-300',
    success: 'bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400',
    gray: 'bg-ink-light/5 text-ink-light/70 dark:bg-ink-dark/10 dark:text-ink-dark/70',
  };
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', tones[tone], className)}>
      {children}
    </span>
  );
}

// Distinct tones so "in progress" (teal) reads differently from a finished,
// successful outcome (success/green) — status is still always paired with
// its text label via titleCase(), never conveyed by color alone.
const STATUS_TONE = {
  pending: 'amber', reviewing: 'amber', pending_approval: 'amber',
  accepted: 'teal', assigned: 'teal', active: 'teal',
  in_transit: 'teal', in_progress: 'teal',
  approved: 'success', delivered: 'success', completed: 'success', fulfilled: 'success',
  closed: 'gray',
  cancelled: 'coral', rejected: 'coral', suspended: 'coral',
  available: 'amber', picked_up: 'teal', pickup_started: 'teal', delivery_started: 'teal',
};

export function StatusBadge({ status, className }) {
  const tone = STATUS_TONE[status] || 'gray';
  return <Badge tone={tone} className={className}>{titleCase(status)}</Badge>;
}

const PRIORITY_TONE = { low: 'gray', medium: 'amber', high: 'coral', critical: 'coral' };

export function PriorityBadge({ level, className }) {
  const tone = PRIORITY_TONE[level] || 'gray';
  return (
    <Badge tone={tone} className={cn(level === 'critical' && 'animate-pulse-soft', className)}>
      {titleCase(level)}
    </Badge>
  );
}
