import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Toggle';
import Button from '../../components/ui/Button';
import FileUpload from '../../components/forms/FileUpload';
import { donationSchema } from '../../validators/donationSchemas';
import { DONATION_CATEGORIES, DONATION_CATEGORY_LABELS, INDIAN_CITIES, BLOOD_GROUPS } from '../../constants/categories';

const categoryOptions = Object.entries(DONATION_CATEGORY_LABELS).map(([value, label]) => ({ value, label }));
const cityOptions = INDIAN_CITIES.map((c) => ({ value: c, label: c }));

export default function DonationForm({ defaultValues, onSubmit, submitLabel = 'Submit Donation', loading }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(donationSchema),
    defaultValues: defaultValues || { category: DONATION_CATEGORIES.FOOD },
  });
  const category = watch('category');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Select label="Category" required options={categoryOptions} {...register('category')} error={errors.category?.message} />
      <Input label="Title" required placeholder="e.g. Cooked meals for 40 people" {...register('title')} error={errors.title?.message} />
      <Textarea label="Description" required rows={3} {...register('description')} error={errors.description?.message} />

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Quantity" type="number" required {...register('quantity')} error={errors.quantity?.message} />
        <Input label="Unit" required placeholder="e.g. plates, kg, pieces" {...register('unit')} error={errors.unit?.message} />
      </div>

      {category === DONATION_CATEGORIES.FOOD && (
        <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-teal-50/50 dark:bg-teal-900/20">
          <Input label="Food Type" {...register('foodType')} placeholder="e.g. Cooked meal, Dry ration" />
          <Select label="Veg / Non-Veg" options={[{ value: 'Vegetarian', label: 'Vegetarian' }, { value: 'Non-Vegetarian', label: 'Non-Vegetarian' }]} {...register('vegNonVeg')} />
          <Input label="People Served (approx.)" type="number" {...register('peopleServed')} />
          <Input label="Packaging Status" {...register('packaging')} placeholder="e.g. Sealed containers" />
        </div>
      )}

      {category === DONATION_CATEGORIES.CLOTHES && (
        <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-900/20">
          <Input label="Clothing Type" {...register('clothingType')} placeholder="e.g. Winter wear, Formal" />
          <Select label="Gender Category" options={[{ value: 'Men', label: 'Men' }, { value: 'Women', label: 'Women' }, { value: 'Unisex', label: 'Unisex' }]} {...register('genderCategory')} />
          <Input label="Age Group" {...register('ageGroup')} placeholder="e.g. Adult, Kids" />
          <Input label="Size" {...register('size')} placeholder="e.g. M, L, Mixed" />
          <Select label="Condition" options={[{ value: 'New', label: 'New' }, { value: 'Gently used', label: 'Gently used' }]} {...register('condition')} />
          <Select label="Season" options={[{ value: 'Summer', label: 'Summer' }, { value: 'Winter', label: 'Winter' }, { value: 'All season', label: 'All season' }]} {...register('season')} />
        </div>
      )}

      {category === DONATION_CATEGORIES.MEDICINE && (
        <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-coral-50/50 dark:bg-coral-900/20">
          <Input label="Medicine Name" {...register('medicineName')} />
          <Input label="Batch Number" {...register('batchNumber')} />
          <Input label="Manufacturer" {...register('manufacturer')} />
          <Input label="Expiry Date" type="date" {...register('expiryDate')} />
          <Checkbox label="Prescription required" {...register('prescriptionRequired')} />
          <Checkbox label="Sealed / unopened condition" {...register('sealedCondition')} />
        </div>
      )}

      {category === DONATION_CATEGORIES.BLOOD && (
        <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-teal-50/50 dark:bg-teal-900/20">
          <Select label="Blood Group" options={BLOOD_GROUPS.map((b) => ({ value: b, label: b }))} {...register('bloodGroup')} />
          <Input label="Units Available" type="number" {...register('unitsAvailable')} />
          <Input label="Preferred Donation Date" type="date" {...register('donationDate')} />
          <Input label="Last Donation Date" type="date" {...register('lastDonationDate')} />
          <Input label="Preferred Hospital" {...register('preferredHospital')} />
          <Checkbox label="I confirm I am medically eligible to donate" {...register('medicalEligibility')} />
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Pickup Address" required {...register('pickupAddress')} error={errors.pickupAddress?.message} />
        <Select label="City" required options={cityOptions} {...register('city')} error={errors.city?.message} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="PIN Code" required {...register('pinCode')} error={errors.pinCode?.message} />
        <Input label="Contact Number" required {...register('contactNumber')} error={errors.contactNumber?.message} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Preferred Pickup Date" type="date" required {...register('preferredPickupDate')} error={errors.preferredPickupDate?.message} />
        <Input label="Availability" placeholder="e.g. Evenings, Weekends" {...register('availability')} />
      </div>
      <Textarea label="Additional Notes" rows={2} {...register('notes')} />
      <FileUpload label="Photos (optional)" hint="Add photos to help the receiving NGO assess your donation" multiple />

      <Button type="submit" size="lg" className="w-full sm:w-auto" loading={loading}>{submitLabel}</Button>
    </form>
  );
}
