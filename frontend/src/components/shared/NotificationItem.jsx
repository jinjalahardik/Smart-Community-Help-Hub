import { Bell, Heart, HandHeart, ClipboardCheck, ShieldCheck, MessageCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { timeAgo } from '../../utils/format';

const ICONS = {
  donation: HandHeart,
  request: Heart,
  task: ClipboardCheck,
  approval: ShieldCheck,
  chat: MessageCircle,
  system: Bell,
};

export default function NotificationItem({ notification, onClick, onDelete }) {
  const Icon = ICONS[notification.category] || Bell;
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-teal-50/60 dark:hover:bg-teal-900/20 transition-colors',
        !notification.read && 'bg-teal-50/40 dark:bg-teal-900/10'
      )}
    >
      <div className="w-9 h-9 rounded-full bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-teal-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{notification.title}</p>
        <p className="text-xs text-ink-light/60 dark:text-ink-dark/60 line-clamp-2 mt-0.5">{notification.message}</p>
        <p className="text-[11px] text-ink-light/40 dark:text-ink-dark/40 mt-1">{timeAgo(notification.createdAt)}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        {!notification.read && <span className="w-2 h-2 rounded-full bg-coral-500" aria-label="Unread" />}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            aria-label="Delete notification"
            className="text-[11px] text-ink-light/40 hover:text-coral-500"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
