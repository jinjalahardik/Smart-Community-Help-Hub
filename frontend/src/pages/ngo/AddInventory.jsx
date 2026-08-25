import { useNavigate } from 'react-router-dom';
import InventoryForm from '../../components/shared/InventoryForm';
import { useCreateInventory } from '../../hooks/useInventory';
import { useAuth } from '../../context/AuthContext';
import { DONATION_CATEGORY_LABELS } from '../../constants/categories';
import { PATHS } from '../../routes/paths';

const categoryOptions = Object.entries(DONATION_CATEGORY_LABELS).map(([value, label]) => ({ value, label }));

export default function AddInventory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createMutation = useCreateInventory();

  const onSubmit = async (data) => {
    await createMutation.mutateAsync({ ...data, ownerId: user.orgId, ownerType: 'ngo' });
    navigate(PATHS.NGO.INVENTORY);
  };

  return (
    <InventoryForm
      title="Add Inventory Item"
      backPath={PATHS.NGO.INVENTORY}
      categoryOptions={categoryOptions}
      onSubmit={onSubmit}
      isSubmitting={createMutation.isPending}
    />
  );
}
