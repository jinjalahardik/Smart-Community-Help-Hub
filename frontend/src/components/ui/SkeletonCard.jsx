import Skeleton from './Skeleton';
import { cn } from '../../utils/cn';

/**
 * Generic card-shaped skeleton placeholder used while list/grid data loads.
 * Renders an avatar-style circle, a couple of title/subtitle bars, and
 * two body lines by default — enough to approximate most card layouts
 * across the app (directory cards, dashboard summary cards, etc).
 */
export default function SkeletonCard({ className, lines = 2, showAvatar = true }) {
  return (
    <div className={cn('rounded-2xl border border-teal-100 dark:border-teal-900/50 bg-white dark:bg-teal-950/30 p-6', className)}>
      <div className="flex items-center gap-3 mb-4">
        {showAvatar && <Skeleton className="w-10 h-10 rounded-full shrink-0" />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-2/3 rounded" />
          <Skeleton className="h-2.5 w-1/3 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={cn('h-2.5 rounded', i === lines - 1 ? 'w-3/4' : 'w-full')} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonCardGrid({ count = 6, className, ...props }) {
  return (
    <div className={cn('grid sm:grid-cols-2 lg:grid-cols-3 gap-5', className)}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} {...props} />)}
    </div>
  );
}
