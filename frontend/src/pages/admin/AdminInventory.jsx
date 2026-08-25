import { useState } from 'react';
import { PageHeader, FilterBar } from '../../components/ui/PageHeader';
import Select from '../../components/ui/Select';
import SearchInput from '../../components/ui/SearchInput';
import DataTable from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { useInventory } from '../../hooks/useInventory';
import { formatDate } from '../../utils/format';

export default function AdminInventory() {
  const [search, setSearch] = useState('');
  const [ownerType, setOwnerType] = useState('');
  const { data: items = [], isLoading } = useInventory({ ownerType, search });

  const columns = [
    { key: 'itemName', header: 'Item' },
    { key: 'category', header: 'Category', render: (i) => <Badge tone="teal">{i.category}</Badge> },
    { key: 'ownerType', header: 'Owner Type', render: (i) => <Badge tone={i.ownerType === 'hospital' ? 'coral' : 'amber'}>{i.ownerType}</Badge> },
    { key: 'quantity', header: 'Quantity', render: (i) => `${i.quantity} ${i.unit}` },
    { key: 'expiryDate', header: 'Expiry', render: (i) => i.expiryDate ? formatDate(i.expiryDate) : 'N/A' },
    { key: 'updatedAt', header: 'Updated', render: (i) => formatDate(i.updatedAt || i.createdAt) },
  ];

  return (
    <div>
      <PageHeader title="Inventory Overview" description="Platform-wide inventory across all NGOs and hospitals" />
      <FilterBar className="mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search inventory..." className="sm:w-72" />
        <Select value={ownerType} onChange={(e) => setOwnerType(e.target.value)} placeholder="All owner types" options={[{ value: 'ngo', label: 'NGO' }, { value: 'hospital', label: 'Hospital' }]} containerClassName="sm:w-44" />
      </FilterBar>
      <DataTable columns={columns} data={items} loading={isLoading} emptyMessage="No inventory items found" />
    </div>
  );
}
