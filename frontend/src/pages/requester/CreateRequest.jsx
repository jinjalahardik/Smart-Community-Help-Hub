import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import EmergencyRequestForm from '../../features/requests/EmergencyRequestForm';
import { useCreateRequest } from '../../hooks/useRequests';
import { useAuth } from '../../context/AuthContext';
import { PATHS } from '../../routes/paths';

export default function CreateRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createRequest = useCreateRequest();

  const handleSubmit = async (data) => {
    await createRequest.mutateAsync({ ...data, requesterId: user.id, requesterName: user.name, contactNumber: data.contactNumber || user.phone });
    navigate(PATHS.REQUESTER.REQUESTS);
  };

  return (
    <div>
      <PageHeader title="Raise Emergency Request" description="Tell us what you need — we'll match you with the fastest available help" breadcrumb={[{ label: 'Dashboard', href: PATHS.REQUESTER.DASHBOARD }, { label: 'Raise Request' }]} />
      <Card className="p-6 max-w-3xl">
        <EmergencyRequestForm onSubmit={handleSubmit} loading={createRequest.isPending} />
      </Card>
    </div>
  );
}
