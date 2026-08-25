import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { useTasks, useCreateTask } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';
import { taskCreateSchema } from '../../validators/miscSchemas';
import { DONATION_CATEGORY_LABELS } from '../../constants/categories';
import { formatDate } from '../../utils/format';

const priorityOptions = [{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }];
const categoryOptions = Object.entries(DONATION_CATEGORY_LABELS).map(([value, label]) => ({ value, label }));

export default function NgoTasks() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const { data: tasks = [], isLoading } = useTasks({ ngoId: user.orgId });
  const createMutation = useCreateTask();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(taskCreateSchema) });

  const onSubmit = async (data) => {
    await createMutation.mutateAsync({ ...data, ngoId: user.orgId });
    reset();
    setModalOpen(false);
  };

  const columns = [
    { key: 'title', header: 'Task' },
    { key: 'category', header: 'Category', render: (t) => DONATION_CATEGORY_LABELS[t.category] || t.category },
    { key: 'priority', header: 'Priority', render: (t) => <PriorityBadge level={t.priority} /> },
    { key: 'assignedVolunteerId', header: 'Volunteer', render: (t) => t.assignedVolunteerId ? 'Assigned' : 'Unassigned' },
    { key: 'createdAt', header: 'Created', render: (t) => formatDate(t.createdAt) },
    { key: 'status', header: 'Status', render: (t) => <StatusBadge status={t.status} /> },
  ];

  return (
    <div>
      <PageHeader title="Task Assignment" description="Publish tasks for volunteers to pick up" actions={<Button icon={Plus} onClick={() => setModalOpen(true)}>New Task</Button>} />
      <DataTable columns={columns} data={tasks} loading={isLoading} emptyMessage="No tasks created yet" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create New Task" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Task Title" required {...register('title')} error={errors.title?.message} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" required options={categoryOptions} {...register('category')} error={errors.category?.message} />
            <Select label="Priority" required options={priorityOptions} {...register('priority')} error={errors.priority?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Pickup Location" required {...register('pickupLocation')} error={errors.pickupLocation?.message} />
            <Input label="Delivery Location" required {...register('deliveryLocation')} error={errors.deliveryLocation?.message} />
          </div>
          <Input label="Contact Number" required {...register('contactInfo')} error={errors.contactInfo?.message} />
          <Textarea label="Instructions" {...register('instructions')} />
          <Button type="submit" className="w-full" loading={createMutation.isPending}>Publish Task</Button>
        </form>
      </Modal>
    </div>
  );
}
