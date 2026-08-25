import { useParams } from 'react-router-dom';
import { Phone, MapPin, Info } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { PriorityBadge, Badge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import StatusTimeline from '../../components/ui/StatusTimeline';
import { PageSpinner } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { useAuth } from '../../context/AuthContext';
import { useTask, useAcceptTask, useAdvanceTaskStatus, useDeclineTask } from '../../hooks/useTasks';
import { PATHS } from '../../routes/paths';
import { TASK_STATUS_ORDER, TASK_STATUS, DONATION_CATEGORY_LABELS } from '../../constants/categories';
import { formatDateTime } from '../../utils/format';

export default function TaskDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: task, isLoading, isError, refetch } = useTask(id);
  const acceptTask = useAcceptTask();
  const advanceStatus = useAdvanceTaskStatus();
  const declineTask = useDeclineTask();

  if (isLoading) return <PageSpinner />;
  if (isError || !task) return <ErrorState title="Task not found" onRetry={refetch} />;

  const isMine = task.assignedVolunteerId === user.id;
  const isCompleted = task.status === TASK_STATUS.COMPLETED;
  const currentIdx = TASK_STATUS_ORDER.indexOf(task.status);

  return (
    <div>
      <PageHeader title={task.title} breadcrumb={[{ label: 'Dashboard', href: PATHS.VOLUNTEER.DASHBOARD }, { label: 'Tasks', href: PATHS.VOLUNTEER.TASKS }, { label: 'Details' }]} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge tone="teal">{DONATION_CATEGORY_LABELS[task.category] || task.category}</Badge>
              <PriorityBadge level={task.priority} />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-teal-500 mt-0.5" /><div><p className="text-xs text-ink-light/65 dark:text-ink-dark/65">Pickup Location</p><p className="font-medium">{task.pickupLocation}</p></div></div>
              <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-coral-500 mt-0.5" /><div><p className="text-xs text-ink-light/65 dark:text-ink-dark/65">Delivery Location</p><p className="font-medium">{task.deliveryLocation}</p></div></div>
              <div className="flex items-start gap-2"><Phone className="w-4 h-4 text-teal-500 mt-0.5" /><div><p className="text-xs text-ink-light/65 dark:text-ink-dark/65">Contact</p><p className="font-medium">{task.contactInfo}</p></div></div>
              {task.instructions && <div className="flex items-start gap-2"><Info className="w-4 h-4 text-amber-500 mt-0.5" /><div><p className="text-xs text-ink-light/65 dark:text-ink-dark/65">Instructions</p><p className="font-medium">{task.instructions}</p></div></div>}
            </div>

            <div className="flex gap-3 mt-6">
              {!task.assignedVolunteerId && (
                <Button onClick={() => acceptTask.mutate({ id: task.id, volunteerId: user.id })} loading={acceptTask.isPending}>Accept Task</Button>
              )}
              {isMine && !isCompleted && (
                <>
                  <Button onClick={() => advanceStatus.mutate(task.id)} loading={advanceStatus.isPending}>Update Status</Button>
                  <Button variant="outline" onClick={() => declineTask.mutate(task.id)} loading={declineTask.isPending}>Decline</Button>
                </>
              )}
            </div>
          </Card>
        </div>

        <Card className="p-6 h-fit">
          <p className="font-display font-semibold mb-4">Status Timeline</p>
          <StatusTimeline steps={TASK_STATUS_ORDER} currentIndex={currentIdx} history={task.statusHistory} />
          <p className="text-xs text-ink-light/40 dark:text-ink-dark/40 mt-4">Created {formatDateTime(task.createdAt)}</p>
        </Card>
      </div>
    </div>
  );
}
