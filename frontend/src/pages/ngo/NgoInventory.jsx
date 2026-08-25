import InventoryList from '../../components/shared/InventoryList';
import { useAuth } from '../../context/AuthContext';
import { DONATION_CATEGORY_LABELS } from '../../constants/categories';
import { PATHS } from '../../routes/paths';

const categoryOptions = Object.entries(DONATION_CATEGORY_LABELS).map(([value, label]) => ({ value, label }));

export default function NgoInventory() {
  const { user } = useAuth();
  return (
    <InventoryList
      title="Inventory"
      description="Track food, clothes, medicine and blood stock at your organization"
      ownerId={user.orgId}
      ownerType="ngo"
      categoryOptions={categoryOptions}
      createPath={PATHS.NGO.INVENTORY_CREATE}
      editPath={PATHS.NGO.INVENTORY_EDIT}
    />
  );
}
