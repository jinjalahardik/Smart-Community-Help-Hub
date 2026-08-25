import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import DonationForm from '../../features/donations/DonationForm';
import { useCreateDonation } from '../../hooks/useDonations';
import { useAuth } from '../../context/AuthContext';
import { PATHS } from '../../routes/paths';

export default function CreateDonation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createDonation = useCreateDonation();

  const handleSubmit = async (data) => {
    await createDonation.mutateAsync({ ...data, donorId: user.id, donorName: user.name, contactNumber: data.contactNumber || user.phone });
    navigate(PATHS.DONOR.DONATIONS);
  };

  return (
    <div>
      <PageHeader title="Create Donation" description="Fill in the details of what you'd like to donate" breadcrumb={[{ label: 'Dashboard', href: PATHS.DONOR.DASHBOARD }, { label: 'Donations', href: PATHS.DONOR.DONATIONS }, { label: 'Create' }]} />
      <Card className="p-6 max-w-3xl">
        <DonationForm onSubmit={handleSubmit} loading={createDonation.isPending} />
      </Card>
    </div>
  );
}
