import { Inbox } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-12 px-4', className)}>
      <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-teal-500" />
      </div>
      <p className="font-display font-semibold text-ink-light dark:text-ink-dark">{title}</p>
      {description && <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
