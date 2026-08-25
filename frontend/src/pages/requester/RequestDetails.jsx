import { useParams, Link } from 'react-router-dom';
import { Pencil, MapPin, Phone, Users, Radar } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge, PriorityBadge, Badge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { PageSpinner } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { useRequest, useConfirmDelivery } from '../../hooks/useRequests';
import { PATHS } from '../../routes/paths';
import { formatDate, formatDateTime } from '../../utils/format';
import { REQUEST_CATEGORY_LABELS } from '../../constants/categories';

export default function RequestDetails() {
  const { id } = useParams();
  const { data: request, isLoading, isError, refetch } = useRequest(id);
  const confirmDelivery = useConfirmDelivery();

  if (isLoading) return <PageSpinner />;
  if (isError || !request) return <ErrorState title="Request not found" onRetry={refetch} />;

  return (
    <div>
      <PageHeader
        title={request.title}
        breadcrumb={[{ label: 'Dashboard', href: PATHS.REQUESTER.DASHBOARD }, { label: 'Requests', href: PATHS.REQUESTER.REQUESTS }, { label: 'Details' }]}
        actions={
          <div className="flex gap-2">
            <Link to={PATHS.REQUESTER.TRACKING(request.id)}><Button variant="outline" icon={Radar}>Track</Button></Link>
            <Link to={PATHS.REQUESTER.EDIT(request.id)}><Button variant="outline" icon={Pencil}>Edit</Button></Link>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Badge tone="teal">{REQUEST_CATEGORY_LABELS[request.category]}</Badge>
            <PriorityBadge level={request.urgency} />
            <StatusBadge status={request.status} />
          </div>
          <p className="text-sm text-ink-light/70 dark:text-ink-dark/70">{request.description}</p>

          <div className="grid sm:grid-cols-2 gap-4 mt-5 text-sm">
            <div><p className="text-ink-light/65 dark:text-ink-dark/65 text-xs">Required Quantity</p><p className="font-medium">{request.requiredQuantity} {request.unit}</p></div>
            <div><p className="text-ink-light/65 dark:text-ink-dark/65 text-xs">Needed Before</p><p className="font-medium">{formatDateTime(request.neededBefore)}</p></div>
            <div className="flex items-start gap-1.5"><MapPin className="w-4 h-4 text-teal-500 mt-0.5" /><div><p className="text-ink-light/65 dark:text-ink-dark/65 text-xs">Address</p><p className="font-medium">{request.address}, {request.city} - {request.pinCode}</p></div></div>
            <div className="flex items-start gap-1.5"><Phone className="w-4 h-4 text-teal-500 mt-0.5" /><div><p className="text-ink-light/65 dark:text-ink-dark/65 text-xs">Contact</p><p className="font-medium">{request.contactNumber}</p></div></div>
            <div className="flex items-start gap-1.5"><Users className="w-4 h-4 text-teal-500 mt-0.5" /><div><p className="text-ink-light/65 dark:text-ink-dark/65 text-xs">Affected People</p><p className="font-medium">{request.affectedPeople}</p></div></div>
          </div>

          {request.vulnerablePersonInfo && (
            <div className="mt-5 pt-5 border-t border-teal-100 dark:border-teal-900/50">
              <p className="text-ink-light/65 dark:text-ink-dark/65 text-xs">Vulnerable Person Info</p>
              <p className="text-sm mt-1">{request.vulnerablePersonInfo}</p>
            </div>
          )}

          {request.status === 'in_progress' && (
            <div className="mt-6 pt-6 border-t border-teal-100 dark:border-teal-900/50">
              <Button onClick={() => confirmDelivery.mutate(request.id)} loading={confirmDelivery.isPending}>Confirm Delivery Received</Button>
            </div>
          )}
        </Card>

        <Card className="p-6 h-fit">
          <p className="font-display font-semibold mb-3">Priority Score</p>
          <p className="text-3xl font-display font-bold text-teal-700 dark:text-teal-300">{request.priorityScore}<span className="text-base text-ink-light/40">/100</span></p>
          <p className="text-xs text-ink-light/65 dark:text-ink-dark/65 mt-2">Raised on {formatDate(request.createdAt)}</p>
        </Card>
      </div>
    </div>
  );
}
