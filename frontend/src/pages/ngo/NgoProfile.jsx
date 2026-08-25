import { useForm } from 'react-hook-form';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import { PageSpinner } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { StatusBadge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useNgoProfile, useUpdateNgoProfile } from '../../hooks/useNgo';

export default function NgoProfile() {
  const { user } = useAuth();
  const { data: org, isLoading, error, refetch } = useNgoProfile(user.orgId);
  const updateMutation = useUpdateNgoProfile();
  const { register, handleSubmit, formState: { errors } } = useForm({ values: org });

  if (isLoading) return <PageSpinner />;
  if (error || !org) return <ErrorState title="Could not load profile" onRetry={refetch} />;

  const onSubmit = (data) => updateMutation.mutate({ orgId: user.orgId, patch: data });

  return (
    <div>
      <PageHeader title="Organization Profile" description="Keep your organization's details up to date" actions={<StatusBadge status={org.verificationStatus} />} />
      <Card className="p-6 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Organization Name" required {...register('name')} error={errors.name?.message} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Contact Person" required {...register('contactPerson')} error={errors.contactPerson?.message} />
            <Input label="Phone" required {...register('phone')} error={errors.phone?.message} />
          </div>
          <Textarea label="Address" required {...register('address')} error={errors.address?.message} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="City" required {...register('city')} error={errors.city?.message} />
            <Input label="Service Radius (km)" type="number" {...register('serviceRadiusKm')} />
          </div>
          <Button type="submit" loading={updateMutation.isPending}>Save Changes</Button>
        </form>
      </Card>
    </div>
  );
}
