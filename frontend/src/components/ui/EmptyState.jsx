import { Inbox } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  action,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-12 px-4', className)}>
      <div className="w-16 h-16 rounded-3xl bg-teal-500/10 dark:bg-teal-400/10 border border-teal-300/30 dark:border-teal-500/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(45,212,191,0.15)]">
        <Icon className="w-7 h-7 text-teal-600 dark:text-teal-400" />
      </div>
      <p className="font-display font-bold text-base text-ink-light dark:text-ink-dark">{title}</p>
      {description && (
        <p className="text-xs sm:text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1.5 max-w-sm leading-relaxed font-body">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
