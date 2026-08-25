import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { PriorityBadge, Badge } from '../../components/ui/Badge';
import StatusTimeline from '../../components/ui/StatusTimeline';
import Button from '../../components/ui/Button';
import { PageSpinner } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { useRequest, useConfirmDelivery } from '../../hooks/useRequests';
import { PATHS } from '../../routes/paths';
import { REQUEST_STATUS } from '../../constants/categories';
import { REQUEST_CATEGORY_LABELS } from '../../constants/categories';

const STEPS = [REQUEST_STATUS.PENDING, REQUEST_STATUS.REVIEWING, REQUEST_STATUS.ASSIGNED, REQUEST_STATUS.IN_PROGRESS, REQUEST_STATUS.FULFILLED];

export default function RequestTracking() {
  const { id } = useParams();
  const { data: request, isLoading, isError, refetch } = useRequest(id);
  const confirmDelivery = useConfirmDelivery();

  if (isLoading) return <PageSpinner />;
  if (isError || !request) return <ErrorState title="Request not found" onRetry={refetch} />;

  const currentIdx = STEPS.indexOf(request.status);

  return (
    <div>
      <PageHeader title="Track Request" breadcrumb={[{ label: 'Dashboard', href: PATHS.REQUESTER.DASHBOARD }, { label: 'Tracking' }]} />

      <Card className="p-6 max-w-2xl">
        <div className="flex items-center gap-2 mb-1">
          <Badge tone="teal">{REQUEST_CATEGORY_LABELS[request.category]}</Badge>
          <PriorityBadge level={request.urgency} />
        </div>
        <p className="font-display font-semibold text-lg mt-2">{request.title}</p>
        <p className="text-sm text-ink-light/60 dark:text-ink-dark/60 mt-1 mb-6">Live status of your request as it moves through our network.</p>

        <StatusTimeline steps={STEPS} currentIndex={currentIdx} />

        {request.status === REQUEST_STATUS.IN_PROGRESS && (
          <Button className="mt-6" onClick={() => confirmDelivery.mutate(request.id)} loading={confirmDelivery.isPending}>
            Confirm Delivery Received
          </Button>
        )}
      </Card>
    </div>
  );
}
