import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Megaphone } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { ROLE_LABELS } from '../../constants/roles';
import { notificationService } from '../../features/notifications/notificationService';

const roleOptions = [{ value: '', label: 'All Roles' }, ...Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))];

export default function AdminNotifications() {
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSending(true);
    try {
      const result = await notificationService.broadcast(data);
      toast.success(`Broadcast sent to ${result.sentCount} recipients`);
      reset();
    } catch (err) {
      toast.error(err.message || 'Failed to send broadcast');
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <PageHeader title="Notification Broadcast" description="Send a platform-wide announcement to a role or all users" />
      <Card className="p-6 max-w-xl">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-sm text-ink-light/60 dark:text-ink-dark/60">This will appear in recipients' notification dropdown instantly.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select label="Send To" options={roleOptions} {...register('role')} />
          <Input label="Title" required {...register('title', { required: 'Title is required' })} error={errors.title?.message} />
          <Textarea label="Message" required {...register('message', { required: 'Message is required' })} error={errors.message?.message} />
          <Button type="submit" className="w-full" loading={sending}>Send Broadcast</Button>
        </form>
      </Card>
    </div>
  );
}
