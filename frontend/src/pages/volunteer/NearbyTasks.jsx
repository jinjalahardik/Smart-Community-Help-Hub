import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { PriorityBadge, Badge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { useTasks, useAcceptTask } from '../../hooks/useTasks';
import { PATHS } from '../../routes/paths';
import { DONATION_CATEGORY_LABELS } from '../../constants/categories';

export default function NearbyTasks() {
  const { user } = useAuth();
  const { data: tasks = [], isLoading } = useTasks({ available: true });
  const acceptTask = useAcceptTask();

  return (
    <div>
      <PageHeader title="Nearby Tasks" description="Available delivery and pickup tasks near you" breadcrumb={[{ label: 'Dashboard', href: PATHS.VOLUNTEER.DASHBOARD }, { label: 'Nearby Tasks' }]} />

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}</div>
      ) : tasks.length === 0 ? (
        <EmptyState title="No tasks available right now" description="Check back soon — new tasks appear as donations and requests are matched." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {tasks.map((t) => (
            <Card key={t.id} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <Badge tone="teal">{DONATION_CATEGORY_LABELS[t.category] || t.category}</Badge>
                <PriorityBadge level={t.priority} />
              </div>
              <p className="font-display font-semibold text-sm">{t.title}</p>
              <div className="text-xs text-ink-light/60 dark:text-ink-dark/60 mt-2 space-y-1">
                <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-teal-500" /> Pickup: {t.pickupLocation}</p>
                <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-coral-500" /> Deliver: {t.deliveryLocation}</p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button size="sm" className="flex-1" onClick={() => acceptTask.mutate({ id: t.id, volunteerId: user.id })} loading={acceptTask.isPending}>
                  Accept Task
                </Button>
                <Link to={PATHS.VOLUNTEER.TASK_DETAILS(t.id)}>
                  <Button size="sm" variant="outline" icon={ArrowRight}>Details</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
