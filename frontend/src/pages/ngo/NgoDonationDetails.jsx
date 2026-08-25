import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MapPin, Package } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { PageSpinner } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { useDonation, useAcceptDonation, useUpdateDonationStatus } from '../../hooks/useDonations';
import { useAuth } from '../../context/AuthContext';
import { DONATION_CATEGORY_LABELS } from '../../constants/categories';
import { formatDateTime } from '../../utils/format';
import { PATHS } from '../../routes/paths';

export default function NgoDonationDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: donation, isLoading, error, refetch } = useDonation(id);
  const acceptMutation = useAcceptDonation();
  const statusMutation = useUpdateDonationStatus();

  if (isLoading) return <PageSpinner />;
  if (error || !donation) return <ErrorState title="Donation not found" onRetry={refetch} />;

  return (
    <div>
      <button onClick={() => navigate(PATHS.NGO.DONATIONS)} className="flex items-center gap-1.5 text-sm text-teal-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to donations
      </button>
      <PageHeader title={donation.title} description={`${DONATION_CATEGORY_LABELS[donation.category]} donation from ${donation.donorName}`} actions={<StatusBadge status={donation.status} />} />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <p className="font-display font-semibold mb-3">Description</p>
          <p className="text-sm text-ink-light/70 dark:text-ink-dark/70">{donation.description}</p>

          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="flex items-start gap-3">
              <Package className="w-4 h-4 text-teal-600 mt-0.5" />
              <div><p className="text-xs text-ink-light/65">Quantity</p><p className="text-sm font-medium">{donation.quantity} {donation.unit}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-teal-600 mt-0.5" />
              <div><p className="text-xs text-ink-light/65">Pickup Address</p><p className="text-sm font-medium">{donation.pickupAddress}, {donation.city}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-teal-600 mt-0.5" />
              <div><p className="text-xs text-ink-light/65">Contact</p><p className="text-sm font-medium">{donation.contactNumber}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <div><p className="text-xs text-ink-light/65">Preferred Pickup</p><p className="text-sm font-medium">{formatDateTime(donation.preferredPickupDate)}</p></div>
            </div>
          </div>
        </Card>

        <Card className="p-6 h-fit">
          <p className="font-display font-semibold mb-4">Actions</p>
          {donation.status === 'pending' && (
            <Button className="w-full" onClick={() => acceptMutation.mutate({ id: donation.id, ngoId: user.orgId })} loading={acceptMutation.isPending}>
              Accept Donation
            </Button>
          )}
          {donation.status === 'accepted' && (
            <Button className="w-full" onClick={() => statusMutation.mutate({ id: donation.id, status: 'in_transit' })} loading={statusMutation.isPending}>
              Mark In Transit
            </Button>
          )}
          {donation.status === 'in_transit' && (
            <Button className="w-full" onClick={() => statusMutation.mutate({ id: donation.id, status: 'completed' })} loading={statusMutation.isPending}>
              Mark Completed
            </Button>
          )}
          {['completed', 'cancelled'].includes(donation.status) && (
            <p className="text-sm text-ink-light/65 text-center">No further actions available.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
