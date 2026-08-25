import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { PageSpinner } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import EmergencyRequestForm from '../../features/requests/EmergencyRequestForm';
import { useRequest, useUpdateRequest } from '../../hooks/useRequests';
import { PATHS } from '../../routes/paths';

export default function EditRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: request, isLoading, isError, refetch } = useRequest(id);
  const updateRequest = useUpdateRequest();

  if (isLoading) return <PageSpinner />;
  if (isError || !request) return <ErrorState title="Request not found" onRetry={refetch} />;

  const handleSubmit = async (data) => {
    await updateRequest.mutateAsync({ id, patch: data });
    navigate(PATHS.REQUESTER.DETAILS(id));
  };

  return (
    <div>
      <PageHeader title="Edit Request" breadcrumb={[{ label: 'Dashboard', href: PATHS.REQUESTER.DASHBOARD }, { label: 'Requests', href: PATHS.REQUESTER.REQUESTS }, { label: 'Edit' }]} />
      <Card className="p-6 max-w-3xl">
        <EmergencyRequestForm defaultValues={request} onSubmit={handleSubmit} submitLabel="Save Changes" loading={updateRequest.isPending} />
      </Card>
    </div>
  );
}
