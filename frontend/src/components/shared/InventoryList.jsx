import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { PageHeader, FilterBar } from '../ui/PageHeader';
import SearchInput from '../ui/SearchInput';
import Select from '../ui/Select';
import DataTable from '../ui/DataTable';
import Button from '../ui/Button';
import { Badge } from '../ui/Badge';
import IconButton from '../ui/IconButton';
import { ConfirmationModal } from '../ui/Modal';
import { useInventory, useDeleteInventory } from '../../hooks/useInventory';
import { formatDate } from '../../utils/format';

export default function InventoryList({ title, description, ownerId, ownerType, categoryOptions, createPath, editPath }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { data: items = [], isLoading } = useInventory({ ownerId, ownerType, search, category });
  const deleteMutation = useDeleteInventory();

  const columns = [
    { key: 'itemName', header: 'Item' },
    { key: 'category', header: 'Category', render: (i) => <Badge tone="teal">{i.category}</Badge> },
    { key: 'quantity', header: 'Quantity', render: (i) => (
      <span className={i.quantity <= i.lowStockThreshold ? 'text-coral-600 font-medium' : ''}>{i.quantity} {i.unit}</span>
    ) },
    { key: 'expiryDate', header: 'Expiry', render: (i) => i.expiryDate ? formatDate(i.expiryDate) : 'N/A' },
    { key: 'updatedAt', header: 'Last Updated', render: (i) => formatDate(i.updatedAt || i.createdAt) },
    {
      key: 'actions', header: '', render: (i) => (
        <div className="flex items-center gap-1.5">
          <Link to={editPath(i.id)}><IconButton icon={Pencil} label="Edit item" size="sm" /></Link>
          <IconButton icon={Trash2} label="Delete item" size="sm" onClick={() => setDeleteTarget(i)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title={title} description={description} actions={<Link to={createPath}><Button icon={Plus}>Add Item</Button></Link>} />
      <FilterBar className="mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search items..." className="sm:w-72" />
        {categoryOptions && <Select value={category} onChange={(e) => setCategory(e.target.value)} placeholder="All categories" options={categoryOptions} containerClassName="sm:w-48" />}
      </FilterBar>
      <DataTable columns={columns} data={items} loading={isLoading} emptyMessage="No inventory items yet" />

      <ConfirmationModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { deleteMutation.mutate(deleteTarget.id); setDeleteTarget(null); }}
        title="Delete inventory item?"
        description={`This will permanently remove "${deleteTarget?.itemName}" from your inventory.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
