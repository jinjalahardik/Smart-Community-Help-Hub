import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import Tabs from '../../components/ui/Tabs';
import { Card } from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import NotificationItem from '../../components/shared/NotificationItem';
import { useAuth } from '../../context/AuthContext';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, useDeleteNotification } from '../../hooks/useNotifications';
import { NOTIFICATION_CATEGORIES } from '../../constants/categories';

const TAB_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Donations', value: NOTIFICATION_CATEGORIES.DONATION },
  { label: 'Requests', value: NOTIFICATION_CATEGORIES.REQUEST },
  { label: 'Tasks', value: NOTIFICATION_CATEGORIES.TASK },
  { label: 'System', value: NOTIFICATION_CATEGORIES.SYSTEM },
];

export default function Notifications() {
  const { user } = useAuth();
  const [tab, setTab] = useState('all');
  const { data: notifications = [], isLoading } = useNotifications(user?.id);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const remove = useDeleteNotification();

  const filtered = tab === 'all' ? notifications : notifications.filter((n) => n.category === tab);

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay up to date with your activity"
        breadcrumb={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Notifications' }]}
        actions={<Button variant="outline" size="sm" onClick={() => markAllRead.mutate(user.id)}>Mark all as read</Button>}
      />
      <Tabs tabs={TAB_OPTIONS} active={tab} onChange={setTab} className="mb-4" />
      <Card className="divide-y divide-teal-100 dark:divide-teal-900/50 overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-ink-light/65">Loading notifications...</div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No notifications" description="You're all caught up!" />
        ) : (
          filtered.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onClick={() => !n.read && markRead.mutate(n.id)}
              onDelete={() => remove.mutate(n.id)}
            />
          ))
        )}
      </Card>
    </div>
  );
}
