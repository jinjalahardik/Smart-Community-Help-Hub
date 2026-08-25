import { useParams, useNavigate } from 'react-router-dom';
import InventoryForm from '../../components/shared/InventoryForm';
import { useInventoryItem, useUpdateInventory } from '../../hooks/useInventory';
import { PageSpinner } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { DONATION_CATEGORY_LABELS } from '../../constants/categories';
import { PATHS } from '../../routes/paths';

const categoryOptions = Object.entries(DONATION_CATEGORY_LABELS).map(([value, label]) => ({ value, label }));

export default function EditInventory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: item, isLoading, error, refetch } = useInventoryItem(id);
  const updateMutation = useUpdateInventory();

  if (isLoading) return <PageSpinner />;
  if (error || !item) return <ErrorState title="Inventory item not found" onRetry={refetch} />;

  const onSubmit = async (data) => {
    await updateMutation.mutateAsync({ id, patch: data });
    navigate(PATHS.NGO.INVENTORY);
  };

  return (
    <InventoryForm
      title="Edit Inventory Item"
      backPath={PATHS.NGO.INVENTORY}
      categoryOptions={categoryOptions}
      defaultValues={item}
      onSubmit={onSubmit}
      isSubmitting={updateMutation.isPending}
    />
  );
}
