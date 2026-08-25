import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { PageSpinner } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { useRequirement, useUpdateRequirement } from '../../hooks/useHospital';
import { formatDateTime } from '../../utils/format';
import { PATHS } from '../../routes/paths';

export default function RequirementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: req, isLoading, error, refetch } = useRequirement(id);
  const updateMutation = useUpdateRequirement();

  if (isLoading) return <PageSpinner />;
  if (error || !req) return <ErrorState title="Requirement not found" onRetry={refetch} />;

  return (
    <div>
      <button onClick={() => navigate(PATHS.HOSPITAL.REQUIREMENTS)} className="flex items-center gap-1.5 text-sm text-teal-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <PageHeader title={req.title} description={req.type === 'blood' ? `Blood Group: ${req.bloodGroup}` : `Medicine: ${req.medicineName}`} actions={<StatusBadge status={req.status} />} />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <p className="font-display font-semibold mb-3">Description</p>
          <p className="text-sm text-ink-light/70 dark:text-ink-dark/70">{req.description}</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
            <div><p className="text-xs text-ink-light/65">Quantity</p><p className="font-medium">{req.quantity} {req.unit}</p></div>
            <div><p className="text-xs text-ink-light/65">Urgency</p><PriorityBadge level={req.urgency} /></div>
            <div><p className="text-xs text-ink-light/65">Needed By</p><p className="font-medium">{formatDateTime(req.neededBy)}</p></div>
            <div><p className="text-xs text-ink-light/65">Published</p><p className="font-medium">{formatDateTime(req.createdAt)}</p></div>
          </div>
        </Card>
        <Card className="p-6 h-fit">
          <p className="font-display font-semibold mb-4">Actions</p>
          {req.status === 'active' ? (
            <Button className="w-full" onClick={() => updateMutation.mutate({ id: req.id, patch: { status: 'fulfilled' } })} loading={updateMutation.isPending}>
              Mark Fulfilled
            </Button>
          ) : (
            <p className="text-sm text-ink-light/65 text-center">This requirement has been fulfilled.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
