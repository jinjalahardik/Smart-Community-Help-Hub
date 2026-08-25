import InventoryManager from '../../components/shared/InventoryManager';
import { useAuth } from '../../context/AuthContext';

export default function BloodInventory() {
  const { user } = useAuth();
  return (
    <InventoryManager
      title="Blood Inventory"
      description="Track blood group availability at your blood bank"
      ownerId={user.orgId}
      ownerType="hospital"
      fixedCategory="blood"
    />
  );
}
