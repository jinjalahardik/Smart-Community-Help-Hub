import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { profileSchema } from '../../validators/miscSchemas';
import { useAuth } from '../../context/AuthContext';
import { INDIAN_CITIES } from '../../constants/categories';
import { ROLE_LABELS } from '../../constants/roles';
import { formatDate } from '../../utils/format';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name, phone: user?.phone, city: user?.city },
  });

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 500));
    updateUser(data);
  };

  return (
    <div>
      <PageHeader title="My Profile" description="Manage your personal information" breadcrumb={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Profile' }]} />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 text-center lg:col-span-1 h-fit">
          <div className="relative w-20 h-20 mx-auto">
            <Avatar name={user?.name} color={user?.avatarColor} size="lg" className="w-20 h-20 text-2xl" />
            <button aria-label="Change photo" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="font-display font-semibold mt-4">{user?.name}</p>
          <p className="text-sm text-ink-light/65 dark:text-ink-dark/65">{user?.email}</p>
          <Badge tone="teal" className="mt-3">{ROLE_LABELS[user?.role]}</Badge>
          <p className="text-xs text-ink-light/40 dark:text-ink-dark/40 mt-4">Member since {formatDate(user?.createdAt)}</p>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" required {...register('name')} error={errors.name?.message} />
            <Input label="Email Address" value={user?.email} disabled hint="Email cannot be changed" />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Phone Number" required {...register('phone')} error={errors.phone?.message} />
              <Select label="City" required options={INDIAN_CITIES.map((c) => ({ value: c, label: c }))} {...register('city')} error={errors.city?.message} />
            </div>
            <Button type="submit" loading={isSubmitting} disabled={!isDirty}>Save Changes</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
