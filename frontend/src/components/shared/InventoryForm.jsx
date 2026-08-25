import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../ui/PageHeader';
import { Card } from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { inventorySchema } from '../../validators/miscSchemas';

export default function InventoryForm({ title, backPath, categoryOptions, defaultValues, onSubmit, isSubmitting }) {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(inventorySchema),
    defaultValues: defaultValues || { category: '', itemName: '', quantity: 0, unit: '', expiryDate: '', lowStockThreshold: 5 },
  });

  return (
    <div>
      <button onClick={() => navigate(backPath)} className="flex items-center gap-1.5 text-sm text-teal-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <PageHeader title={title} />
      <Card className="p-6 max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select label="Category" required options={categoryOptions} {...register('category')} error={errors.category?.message} />
          <Input label="Item Name" required {...register('itemName')} error={errors.itemName?.message} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Quantity" type="number" required {...register('quantity')} error={errors.quantity?.message} />
            <Input label="Unit" required placeholder="e.g. bags, units, strips" {...register('unit')} error={errors.unit?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Expiry Date" type="date" {...register('expiryDate')} error={errors.expiryDate?.message} />
            <Input label="Low Stock Threshold" type="number" required {...register('lowStockThreshold')} error={errors.lowStockThreshold?.message} />
          </div>
          <Button type="submit" className="w-full" loading={isSubmitting}>Save Item</Button>
        </form>
      </Card>
    </div>
  );
}
