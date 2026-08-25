import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { PageSpinner } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import DonationForm from '../../features/donations/DonationForm';
import { useDonation, useUpdateDonation } from '../../hooks/useDonations';
import { PATHS } from '../../routes/paths';

export default function EditDonation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: donation, isLoading, isError, refetch } = useDonation(id);
  const updateDonation = useUpdateDonation();

  if (isLoading) return <PageSpinner />;
  if (isError || !donation) return <ErrorState title="Donation not found" onRetry={refetch} />;

  const handleSubmit = async (data) => {
    await updateDonation.mutateAsync({ id, patch: data });
    navigate(PATHS.DONOR.DETAILS(id));
  };

  return (
    <div>
      <PageHeader title="Edit Donation" breadcrumb={[{ label: 'Dashboard', href: PATHS.DONOR.DASHBOARD }, { label: 'Donations', href: PATHS.DONOR.DONATIONS }, { label: 'Edit' }]} />
      <Card className="p-6 max-w-3xl">
        <DonationForm defaultValues={donation} onSubmit={handleSubmit} submitLabel="Save Changes" loading={updateDonation.isPending} />
      </Card>
    </div>
  );
}
