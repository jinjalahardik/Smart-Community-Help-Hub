import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import { RadioGroup } from '../../components/ui/Toggle';
import { useCreateRequirement } from '../../hooks/useHospital';
import { useAuth } from '../../context/AuthContext';
import { BLOOD_GROUPS } from '../../constants/categories';
import { PATHS } from '../../routes/paths';

const schema = z.object({
  type: z.string().min(1),
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  bloodGroup: z.string().optional(),
  medicineName: z.string().optional(),
  quantity: z.coerce.number().positive('Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  urgency: z.string().min(1, 'Urgency is required'),
  neededBy: z.string().min(1, 'Please specify when this is needed by'),
});

const urgencyOptions = [{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }];
const bloodGroupOptions = BLOOD_GROUPS.map((b) => ({ value: b, label: b }));

export default function CreateRequirement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createMutation = useCreateRequirement();
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { type: 'blood', unit: 'units' },
  });
  const type = watch('type');

  const onSubmit = async (data) => {
    await createMutation.mutateAsync({ ...data, hospitalId: user.orgId, hospitalName: user.name });
    navigate(PATHS.HOSPITAL.REQUIREMENTS);
  };

  return (
    <div>
      <button onClick={() => navigate(PATHS.HOSPITAL.REQUIREMENTS)} className="flex items-center gap-1.5 text-sm text-teal-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <PageHeader title="Create Requirement" description="Publish a blood or medicine requirement for donor coordination" />
      <Card className="p-6 max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <RadioGroup label="Requirement Type" name="type" columns={2} value={type} onChange={(v) => setValue('type', v)} options={[{ value: 'blood', label: 'Blood' }, { value: 'medicine', label: 'Medicine' }]} />
          <Input label="Title" required {...register('title')} error={errors.title?.message} />
          <Textarea label="Description" required {...register('description')} error={errors.description?.message} />
          {type === 'blood' ? (
            <Select label="Blood Group" required options={bloodGroupOptions} {...register('bloodGroup')} error={errors.bloodGroup?.message} />
          ) : (
            <Input label="Medicine Name" required {...register('medicineName')} error={errors.medicineName?.message} />
          )}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Quantity" type="number" required {...register('quantity')} error={errors.quantity?.message} />
            <Input label="Unit" required {...register('unit')} error={errors.unit?.message} />
          </div>
          <Select label="Urgency" required options={urgencyOptions} {...register('urgency')} error={errors.urgency?.message} />
          <Input label="Needed By" type="datetime-local" required {...register('neededBy')} error={errors.neededBy?.message} />
          <Button type="submit" className="w-full" loading={isSubmitting}>Publish Requirement</Button>
        </form>
      </Card>
    </div>
  );
}
