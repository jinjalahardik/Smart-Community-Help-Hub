import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import { RadioGroup, Checkbox } from '../../components/ui/Toggle';
import Button from '../../components/ui/Button';
import FileUpload from '../../components/forms/FileUpload';
import { Card } from '../../components/ui/Card';
import { emergencyRequestSchema } from '../../validators/donationSchemas';
import { REQUEST_CATEGORIES, REQUEST_CATEGORY_LABELS, URGENCY_LEVELS, INDIAN_CITIES } from '../../constants/categories';
import { calculatePriorityScore } from '../../utils/priorityScore';

const categoryOptions = Object.entries(REQUEST_CATEGORY_LABELS).map(([value, label]) => ({ value, label }));
const cityOptions = INDIAN_CITIES.map((c) => ({ value: c, label: c }));
const urgencyOptions = [
  { value: URGENCY_LEVELS.LOW, label: 'Low' },
  { value: URGENCY_LEVELS.MEDIUM, label: 'Medium' },
  { value: URGENCY_LEVELS.HIGH, label: 'High' },
  { value: URGENCY_LEVELS.CRITICAL, label: 'Critical' },
];

export default function EmergencyRequestForm({ defaultValues, onSubmit, submitLabel = 'Submit Request', loading }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(emergencyRequestSchema),
    defaultValues: defaultValues || { category: REQUEST_CATEGORIES.FOOD, urgency: URGENCY_LEVELS.MEDIUM },
  });

  const urgency = watch('urgency');
  const affectedPeople = watch('affectedPeople');
  const neededBefore = watch('neededBefore');

  const submit = (data) => {
    const score = calculatePriorityScore(data);
    onSubmit({ ...data, priorityScore: score });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5">
      <Select label="Request Category" required options={categoryOptions} {...register('category')} error={errors.category?.message} />
      <RadioGroup label="Urgency Level" name="urgency" options={urgencyOptions} value={urgency} onChange={(v) => setValue('urgency', v)} columns={2} error={errors.urgency?.message} />

      <Input label="Title" required placeholder="e.g. Insulin needed urgently" {...register('title')} error={errors.title?.message} />
      <Textarea label="Description" required rows={3} {...register('description')} error={errors.description?.message} />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Required Quantity" type="number" required {...register('requiredQuantity')} error={errors.requiredQuantity?.message} />
        <Input label="Unit" required placeholder="e.g. vials, meals, units" {...register('unit')} error={errors.unit?.message} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Address" required {...register('address')} error={errors.address?.message} />
        <Select label="City" required options={cityOptions} {...register('city')} error={errors.city?.message} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="PIN Code" required {...register('pinCode')} error={errors.pinCode?.message} />
        <Input label="Contact Number" required {...register('contactNumber')} error={errors.contactNumber?.message} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Number of Affected People" type="number" required {...register('affectedPeople')} error={errors.affectedPeople?.message} />
        <Input label="Needed Before" type="datetime-local" required {...register('neededBefore')} error={errors.neededBefore?.message} />
      </div>

      <Textarea label="Vulnerable Person Information (optional)" rows={2} placeholder="e.g. elderly, children, disability" {...register('vulnerablePersonInfo')} />
      <FileUpload label="Supporting Document / Photo (optional)" hint="Helps NGOs verify and prioritize your request" />
      <Checkbox label="I consent to sharing this information with verified NGOs and hospitals to receive help" {...register('consentGiven')} error={errors.consentGiven?.message} />

      {(urgency || affectedPeople) && (
        <Card className="p-4 bg-teal-50/60 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800">
          <p className="text-xs text-ink-light/60 dark:text-ink-dark/60">Estimated Priority Score</p>
          <p className="text-2xl font-display font-bold text-teal-700 dark:text-teal-300">
            {calculatePriorityScore({ urgency, affectedPeople: Number(affectedPeople) || 1, neededBefore })} / 100
          </p>
          <p className="text-xs text-ink-light/65 dark:text-ink-dark/65 mt-1">Based on urgency, people affected, and time sensitivity. Higher scores are matched first.</p>
        </Card>
      )}

      <Button type="submit" size="lg" className="w-full sm:w-auto" variant="coral" loading={loading}>{submitLabel}</Button>
    </form>
  );
}
