import { useParams, Link } from 'react-router-dom';
import { Pencil, Phone, MapPin } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { StatusBadge, Badge } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import StatusTimeline from '../../components/ui/StatusTimeline';
import { PageSpinner } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { useDonation } from '../../hooks/useDonations';
import { PATHS } from '../../routes/paths';
import { formatDate, formatDateTime, titleCase } from '../../utils/format';
import { DONATION_CATEGORY_LABELS, DONATION_STATUS } from '../../constants/categories';

const STEPS = [DONATION_STATUS.PENDING, DONATION_STATUS.ACCEPTED, DONATION_STATUS.IN_TRANSIT, DONATION_STATUS.DELIVERED, DONATION_STATUS.COMPLETED];

export default function DonationDetails() {
  const { id } = useParams();
  const { data: donation, isLoading, isError, refetch } = useDonation(id);

  if (isLoading) return <PageSpinner />;
  if (isError || !donation) return <ErrorState title="Donation not found" onRetry={refetch} />;

  const currentIdx = STEPS.indexOf(donation.status);
  const extraFields = Object.entries(donation).filter(([k, v]) =>
    !['id', 'donorId', 'donorName', 'category', 'title', 'description', 'quantity', 'unit', 'pickupAddress', 'city',
      'pinCode', 'preferredPickupDate', 'contactNumber', 'status', 'availability', 'notes', 'createdAt', 'images', 'updatedAt'].includes(k) && v !== undefined && v !== '' && v !== null
  );

  return (
    <div>
      <PageHeader
        title={donation.title}
        breadcrumb={[{ label: 'Dashboard', href: PATHS.DONOR.DASHBOARD }, { label: 'Donations', href: PATHS.DONOR.DONATIONS }, { label: 'Details' }]}
        actions={<Link to={PATHS.DONOR.EDIT(donation.id)}><Button variant="outline" icon={Pencil}>Edit</Button></Link>}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Badge tone="teal">{DONATION_CATEGORY_LABELS[donation.category]}</Badge>
              <StatusBadge status={donation.status} />
            </div>
            <p className="text-sm text-ink-light/70 dark:text-ink-dark/70">{donation.description}</p>

            <div className="grid sm:grid-cols-2 gap-4 mt-5 text-sm">
              <div><p className="text-ink-light/65 dark:text-ink-dark/65 text-xs">Quantity</p><p className="font-medium">{donation.quantity} {donation.unit}</p></div>
              <div><p className="text-ink-light/65 dark:text-ink-dark/65 text-xs">Preferred Pickup</p><p className="font-medium">{formatDate(donation.preferredPickupDate)}</p></div>
              <div className="flex items-start gap-1.5"><MapPin className="w-4 h-4 text-teal-500 mt-0.5" /><div><p className="text-ink-light/65 dark:text-ink-dark/65 text-xs">Pickup Address</p><p className="font-medium">{donation.pickupAddress}, {donation.city} - {donation.pinCode}</p></div></div>
              <div className="flex items-start gap-1.5"><Phone className="w-4 h-4 text-teal-500 mt-0.5" /><div><p className="text-ink-light/65 dark:text-ink-dark/65 text-xs">Contact</p><p className="font-medium">{donation.contactNumber}</p></div></div>
            </div>

            {extraFields.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-3 mt-5 pt-5 border-t border-teal-100 dark:border-teal-900/50 text-sm">
                {extraFields.map(([k, v]) => (
                  <div key={k}><p className="text-ink-light/65 dark:text-ink-dark/65 text-xs">{titleCase(k)}</p><p className="font-medium">{typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}</p></div>
                ))}
              </div>
            )}
            {donation.notes && (
              <div className="mt-5 pt-5 border-t border-teal-100 dark:border-teal-900/50">
                <p className="text-ink-light/65 dark:text-ink-dark/65 text-xs">Notes</p>
                <p className="text-sm mt-1">{donation.notes}</p>
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6 h-fit">
          <p className="font-display font-semibold mb-4">Status Timeline</p>
          <StatusTimeline steps={STEPS} currentIndex={currentIdx} history={[{ status: donation.status, at: donation.updatedAt || donation.createdAt }]} />
          <p className="text-xs text-ink-light/40 dark:text-ink-dark/40 mt-4">Created {formatDateTime(donation.createdAt)}</p>
        </Card>
      </div>
    </div>
  );
}
