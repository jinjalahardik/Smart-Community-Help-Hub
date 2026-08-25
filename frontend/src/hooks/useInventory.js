import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { inventoryService } from '../features/inventory/inventoryService';

export function useInventory(filters = {}) {
  return useQuery({ queryKey: ['inventory', filters], queryFn: () => inventoryService.list(filters) });
}

export function useInventoryItem(id) {
  return useQuery({ queryKey: ['inventoryItem', id], queryFn: () => inventoryService.getById(id), enabled: !!id });
}

export function useCreateInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Inventory item added');
    },
    onError: (err) => toast.error(err.message || 'Failed to add item'),
  });
}

export function useUpdateInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => inventoryService.update(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Inventory item updated');
    },
    onError: (err) => toast.error(err.message || 'Failed to update item'),
  });
}

export function useDeleteInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: inventoryService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Inventory item removed');
    },
    onError: (err) => toast.error(err.message || 'Failed to remove item'),
  });
}
