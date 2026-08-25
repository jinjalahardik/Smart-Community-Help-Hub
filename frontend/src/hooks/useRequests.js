import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { requestService } from '../features/requests/requestService';

export function useRequests(filters = {}) {
  return useQuery({ queryKey: ['requests', filters], queryFn: () => requestService.list(filters) });
}

export function useRequest(id) {
  return useQuery({ queryKey: ['request', id], queryFn: () => requestService.getById(id), enabled: !!id });
}

export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: requestService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Emergency request submitted');
    },
    onError: (err) => toast.error(err.message || 'Failed to submit request'),
  });
}

export function useUpdateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }) => requestService.update(id, patch),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['requests'] });
      qc.invalidateQueries({ queryKey: ['request', id] });
      toast.success('Request updated');
    },
    onError: (err) => toast.error(err.message || 'Failed to update request'),
  });
}

export function useDeleteRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: requestService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Request deleted');
    },
    onError: (err) => toast.error(err.message || 'Failed to delete request'),
  });
}

export function useAssignRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ngoId }) => requestService.assign(id, ngoId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Request assigned');
    },
    onError: (err) => toast.error(err.message || 'Failed to assign request'),
  });
}

export function useConfirmDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: requestService.confirmDelivery,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['requests'] });
      toast.success('Delivery confirmed. Thank you!');
    },
    onError: (err) => toast.error(err.message || 'Failed to confirm delivery'),
  });
}
