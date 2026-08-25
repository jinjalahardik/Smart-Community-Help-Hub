import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader, FilterBar } from '../ui/PageHeader';
import SearchInput from '../ui/SearchInput';
import DataTable from '../ui/DataTable';
import Button from '../ui/Button';
import IconButton from '../ui/IconButton';
import Modal, { ConfirmationModal } from '../ui/Modal';
import Input from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useInventory, useCreateInventory, useUpdateInventory, useDeleteInventory } from '../../hooks/useInventory';
import { inventorySchema } from '../../validators/miscSchemas';
import { formatDate } from '../../utils/format';

export default function InventoryManager({ title, description, ownerId, ownerType, fixedCategory }) {
  const [search, setSearch] = useState('');
  const [modalItem, setModalItem] = useState(null); // null = closed, {} = create, {...} = edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { data: items = [], isLoading } = useInventory({ ownerId, ownerType, category: fixedCategory, search });
  const createMutation = useCreateInventory();
  const updateMutation = useUpdateInventory();
  const deleteMutation = useDeleteInventory();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(inventorySchema),
  });

  const openCreate = () => { reset({ itemName: '', quantity: 0, unit: '', expiryDate: '', lowStockThreshold: 5, category: fixedCategory || '' }); setModalItem({}); setValue('category', fixedCategory || ''); };
  const openEdit = (item) => { reset(item); setModalItem(item); setValue('category', fixedCategory || item.category); };

  const onSubmit = async (data) => {
    const payload = { ...data, category: fixedCategory || data.category, ownerId, ownerType };
    if (modalItem?.id) await updateMutation.mutateAsync({ id: modalItem.id, patch: payload });
    else await createMutation.mutateAsync(payload);
    setModalItem(null);
  };

  const columns = [
    { key: 'itemName', header: 'Item' },
    ...(fixedCategory ? [] : [{ key: 'category', header: 'Category', render: (i) => <Badge tone="teal">{i.category}</Badge> }]),
    { key: 'quantity', header: 'Quantity', render: (i) => <span className={i.quantity <= i.lowStockThreshold ? 'text-coral-600 font-medium' : ''}>{i.quantity} {i.unit}</span> },
    { key: 'expiryDate', header: 'Expiry', render: (i) => i.expiryDate ? formatDate(i.expiryDate) : 'N/A' },
    { key: 'updatedAt', header: 'Updated', render: (i) => formatDate(i.updatedAt || i.createdAt) },
    {
      key: 'actions', header: '', render: (i) => (
        <div className="flex items-center gap-1.5">
          <IconButton icon={Pencil} label="Edit" size="sm" onClick={() => openEdit(i)} />
          <IconButton icon={Trash2} label="Delete" size="sm" onClick={() => setDeleteTarget(i)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title={title} description={description} actions={<Button icon={Plus} onClick={openCreate}>Add Item</Button>} />
      <FilterBar className="mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search items..." className="sm:w-72" />
      </FilterBar>
      <DataTable columns={columns} data={items} loading={isLoading} emptyMessage="No inventory items yet" />

      <Modal open={!!modalItem} onClose={() => setModalItem(null)} title={modalItem?.id ? 'Edit Item' : 'Add Item'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!fixedCategory && <Input label="Category" required {...register('category')} error={errors.category?.message} />}
          <Input label="Item Name" required {...register('itemName')} error={errors.itemName?.message} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Quantity" type="number" required {...register('quantity')} error={errors.quantity?.message} />
            <Input label="Unit" required {...register('unit')} error={errors.unit?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Expiry Date" type="date" {...register('expiryDate')} />
            <Input label="Low Stock Threshold" type="number" required {...register('lowStockThreshold')} error={errors.lowStockThreshold?.message} />
          </div>
          <Button type="submit" className="w-full" loading={createMutation.isPending || updateMutation.isPending}>Save Item</Button>
        </form>
      </Modal>

      <ConfirmationModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { deleteMutation.mutate(deleteTarget.id); setDeleteTarget(null); }}
        title="Delete inventory item?"
        description={`This will permanently remove "${deleteTarget?.itemName}".`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
