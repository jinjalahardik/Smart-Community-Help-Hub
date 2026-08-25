import InventoryManager from '../../components/shared/InventoryManager';
import { useAuth } from '../../context/AuthContext';

export default function MedicineInventory() {
  const { user } = useAuth();
  return (
    <InventoryManager
      title="Medicine Inventory"
      description="Track medicine and medical supply stock"
      ownerId={user.orgId}
      ownerType="hospital"
      fixedCategory="medicine"
    />
  );
}
